const axios = require('axios');

class EnrichmentService {
  async enrichName(name) {
    try {
      const response = await axios.get(`https://api.nationalize.io?name=${encodeURIComponent(name)}`);
      const data = response.data;

      if (!data.country || data.country.length === 0) {
        return {
          country: 'Unknown',
          probability: 0,
          status: 'To Check'
        };
      }

      const topCountry = data.country[0];
      const probability = topCountry.probability;

      return {
        country: topCountry.country_id,
        probability: probability,
        status: probability >= 0.6 ? 'Verified' : 'To Check'
      };
    } catch (error) {
      console.error(`Error enriching name ${name}:`, error.message);
      return {
        country: 'Error',
        probability: 0,
        status: 'To Check'
      };
    }
  }

  async enrichBatch(names) {
    const results = [];
    const batchSize = 3;

    for (let i = 0; i < names.length; i += batchSize) {
      const batch = names.slice(i, i + batchSize);
      const promises = batch.map(name => this.enrichName(name));
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);

      if (i + batchSize < names.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return results;
  }
}

module.exports = new EnrichmentService();