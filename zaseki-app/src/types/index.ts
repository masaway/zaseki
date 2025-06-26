// 基本的な型定義
export interface Member {
  id: string;
  name: string;
  avatar: string;
  department: string;
  role: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  comment?: string;
  project?: string;
  location?: Location;
}

export interface Location {
  id: string;
  type: 'office' | 'remote';
  name: string;
  city?: string;
  prefecture?: string;
  coordinates?: {
    x: number;
    y: number;
  };
}

export interface Seat {
  id: string;
  number: string;
  floor: number;
  section: string;
  position: {
    x: number;
    y: number;
  };
  occupied: boolean;
  occupiedBy?: Member;
  qrCode?: string;
  orientation?: 'up' | 'down' | 'left' | 'right';
}

export interface Constellation {
  id: string;
  name: string;
  members: Member[];
  connections: Connection[];
  position: {
    x: number;
    y: number;
  };
  color: string;
}

export interface Connection {
  from: string;
  to: string;
  type: 'project' | 'department' | 'location';
}

export type ViewMode = 'office' | 'starmap';

export interface AppState {
  members: Member[];
  seats: Seat[];
  constellations: Constellation[];
  currentView: ViewMode;
  selectedMember?: Member;
}