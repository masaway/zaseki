import { Member, Seat } from "@/types";
import {
  calculateRegionalPosition,
  transformOfficeLayout,
  getZoneByPrefecture,
} from "@/utils/fan-layout";
import {
  MemberWithPosition,
  RemoteMemberData,
  Position,
} from "@/types/starmap";

export function getOfficeMembers(
  seats: Seat[],
  officeCenter: Position,
): MemberWithPosition[] {
  return seats
    .filter((seat) => seat.occupied && seat.occupiedBy)
    .map((seat) => ({
      member: seat.occupiedBy!,
      position: transformOfficeLayout(seat.position, officeCenter),
    }));
}

export function getRemoteMembers(
  constellations: { members: Member[] }[],
  officeMembers: MemberWithPosition[],
  screenWidth: number,
  screenHeight: number,
): RemoteMemberData[] {
  const allRemoteMembers = constellations.flatMap((constellation) =>
    constellation.members
      .filter(
        (member) =>
          !officeMembers.some((office) => office.member.id === member.id) &&
          member.location,
      )
      .map((member) => ({
        member,
        constellation,
        prefecture: member.location!.prefecture!,
      })),
  );

  const groupedByZone: Record<string, typeof allRemoteMembers> = {};
  allRemoteMembers.forEach((member) => {
    const zoneName = getZoneByPrefecture(member.prefecture) || "central";
    if (!groupedByZone[zoneName]) {
      groupedByZone[zoneName] = [];
    }
    groupedByZone[zoneName].push(member);
  });

  return Object.entries(groupedByZone).flatMap(([zoneName, members]) =>
    members.map((memberData, index) => ({
      member: memberData.member,
      constellation: memberData.constellation,
      zoneName,
      position: calculateRegionalPosition(
        memberData.prefecture,
        index,
        members.length,
        screenWidth,
        screenHeight,
      ),
    })),
  );
}

export function getConnectedMemberIds(
  selectedMember: Member | undefined,
  allMembers: MemberWithPosition[],
): string[] {
  if (!selectedMember) return [];

  return allMembers
    .filter(
      ({ member }) =>
        member.project === selectedMember.project &&
        member.id !== selectedMember.id,
    )
    .map(({ member }) => member.id);
}
