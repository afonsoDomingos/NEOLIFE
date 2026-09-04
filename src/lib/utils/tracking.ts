// Campaign tracking utilities

export interface CampaignData {
  campaign?: string;
  source?: string;
  medium?: string;
  content?: string;
  term?: string;
}

export const getCampaignDataFromUrl = (searchParams: URLSearchParams): CampaignData => {
  return {
    campaign: searchParams.get('campanha') || searchParams.get('campaign') || undefined,
    source: searchParams.get('source') || searchParams.get('utm_source') || undefined,
    medium: searchParams.get('medium') || searchParams.get('utm_medium') || undefined,
    content: searchParams.get('content') || searchParams.get('utm_content') || undefined,
    term: searchParams.get('term') || searchParams.get('utm_term') || undefined,
  };
};

export const buildCampaignUrl = (baseUrl: string, campaignData: CampaignData): string => {
  const url = new URL(baseUrl);
  
  if (campaignData.campaign) url.searchParams.set('campanha', campaignData.campaign);
  if (campaignData.source) url.searchParams.set('utm_source', campaignData.source);
  if (campaignData.medium) url.searchParams.set('utm_medium', campaignData.medium);
  if (campaignData.content) url.searchParams.set('utm_content', campaignData.content);
  if (campaignData.term) url.searchParams.set('utm_term', campaignData.term);
  
  return url.toString();
};

// Event tracking for analytics
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // This would integrate with Google Analytics, Meta Pixel, etc.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
  
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, properties);
  }
  
  console.log('Track:', eventName, properties);
};

// Specific conversion events
export const trackLeadGenerated = (leadData: {
  theme: string;
  country: string;
  campaign?: string;
}) => {
  trackEvent('generate_lead', {
    theme: leadData.theme,
    country: leadData.country,
    campaign: leadData.campaign,
  });
};

export const trackPageView = (page: string, campaignData?: CampaignData) => {
  trackEvent('page_view', {
    page,
    ...campaignData,
  });
};

export const trackThemeSelected = (theme: string, campaignData?: CampaignData) => {
  trackEvent('theme_selected', {
    theme,
    ...campaignData,
  });
};

export const trackCountrySelected = (country: string, campaignData?: CampaignData) => {
  trackEvent('country_selected', {
    country,
    ...campaignData,
  });
};