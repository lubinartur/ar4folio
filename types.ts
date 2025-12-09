export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  fullDescription: {
    challenge: string;
    solution: string;
    result: string;
  };
  tags: string[];
  image: string;
  gallery?: string[];
  featured: boolean;
  year: string;
}

export interface Job {
  company: string;
  role: string;
  period: string;
  description?: string;
  items?: string[];
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}