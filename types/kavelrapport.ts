export type AnalysisType = 'plot' | 'existing_property';
export type Stage = 'orientation' | 'considering_offer' | 'offer_made';
export type TimeHorizon = '0_6' | '6_12' | '12_plus';
export type Goal = 'renovate' | 'rebuild' | 'unsure';

export interface KavelrapportIntakeRequest {
  analysisType: AnalysisType;
  address: string;
  link: string;
  stage: Stage;
  timeHorizon: TimeHorizon;
  email: string;
  notes?: string;
  goal?: Goal;
}

export interface KavelrapportIntakeResponse {
  ok: boolean;
  error?: string;
}
