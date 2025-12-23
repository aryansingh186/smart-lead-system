const cron = require('node-cron');
const Lead = require('../models/Lead');

class SyncJob {
  constructor() {
    this.isRunning = false; 
  }

  start() {
    // Runs every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      if (this.isRunning) {
        console.log('[CRM Sync] Previous job still running, skipping this tick.');
        return;
      }

      this.isRunning = true;
      const startTime = new Date();
      console.log(`[CRM Sync] Job started at ${startTime.toISOString()}`);

      try {
        await this.syncVerifiedLeads();
      } catch (error) {
        console.error('[CRM Sync] Error in cron job:', error);
      } finally {
        this.isRunning = false;
        const endTime = new Date();
        console.log(`[CRM Sync] Job finished at ${endTime.toISOString()} (Duration: ${((endTime - startTime)/1000).toFixed(2)}s)`);
      }
    });

    console.log(' Background sync job started (runs every 5 minutes)');
  }

  async syncVerifiedLeads() {
    const leadsToSync = await Lead.find({ status: 'Verified', synced: false });

    if (!leadsToSync.length) {
      console.log('[CRM Sync] No verified leads to sync.');
      return;
    }

    console.log(`[CRM Sync] Found ${leadsToSync.length} verified lead(s) to sync.`);

    // Parallel update using Promise.all
    await Promise.all(
      leadsToSync.map(async (lead) => {
        try {
          console.log(`[CRM Sync] Sending lead ${lead.name} to Sales Team...`);
          lead.synced = true;
          lead.syncedAt = new Date();
          await lead.save();
        } catch (err) {
          console.error(`[CRM Sync] Error syncing lead ${lead.name}:`, err);
        }
      })
    );

    console.log(`[CRM Sync] Successfully synced ${leadsToSync.length} lead(s).`);
  }
}

module.exports = new SyncJob();

