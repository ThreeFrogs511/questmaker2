import "server-only";
import fetchCampaign from "@/lib/campaign/fetchCampaign";


type campaignType = {
  id?: number;
  name?: string;
  description?: string;
  mongo_id?: string;
  chapter?: number;
  err?: string;
};

export class Launcher {
  private campaign: campaignType | null;

  constructor() {
    this.campaign = null;
  }

  async returnCampaignData() {
    this.campaign = await fetchCampaign();
    return {
      name: this.campaign.name,
      description: this.campaign.description,
      chapter: this.campaign.chapter,
      quest_id: this.campaign.mongo_id,
      err: this.campaign.err ?? null,
    };
  };

  async formattingCampaignNameForUrl() {
    if (!this.campaign || !this.campaign.name) return;
    const firstLetterToLowercase = this.campaign.name
      .charAt(0)
      .toLocaleLowerCase();
    const pathname = this.campaign.name
      .replace(this.campaign.name.charAt(0), firstLetterToLowercase)
      .replaceAll(" ", "_");
    return pathname;
  }


}
