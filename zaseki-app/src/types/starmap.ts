import { Member } from "@/types";

export interface Position {
  x: number;
  y: number;
}

export interface MemberWithPosition {
  member: Member;
  position: Position;
}

export interface RemoteMemberData extends MemberWithPosition {
  constellation: { members: Member[] };
  zoneName: string;
}

export interface ConnectionLine {
  from: MemberWithPosition;
  to: MemberWithPosition;
  index: number;
}

export interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface ScreenSize {
  width: number;
  height: number;
}
