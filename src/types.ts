export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  long_description: string;
  tags: string; // Comma-separated or serialized string
  live_url: string;
  github_url: string;
  image_url: string;
  featured: boolean;
  order_num: number;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface DbStatus {
  connected: boolean;
  usingFallback: boolean;
  databaseName?: string;
  host?: string;
}
