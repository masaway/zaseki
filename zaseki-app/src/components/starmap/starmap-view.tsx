"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppStore } from "@/stores/app-store";
import { MemberTooltip } from "../constellation/member-tooltip";
import { ProjectConnections } from "../ui/project-connections";
import { CompactSeat } from "../office/compact-seat";
import { ZoomControls } from "../ui/zoom-controls";
import { Legend } from "../ui/legend";
import { RemoteMember } from "../constellation/remote-member";
import { BackgroundStars } from "./background-stars";
import { OrbitingPlanets } from "./orbiting-planets";
import { getOfficeCenter, transformOfficeLayout } from "@/utils/fan-layout";
import { useZoom } from "@/hooks/use-zoom";
import {
  getOfficeMembers,
  getRemoteMembers,
  getConnectedMemberIds,
} from "./starmap-utils";
import { MemberWithPosition, ScreenSize } from "@/types/starmap";

export function StarmapView() {
  const { seats, constellations, selectedMember, setSelectedMember } =
    useAppStore();
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: 1024,
    height: 768,
  });

  const {
    zoomState,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetZoom,
    zoomIn,
    zoomOut,
  } = useZoom();

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const officeCenter = useMemo(
    () => getOfficeCenter(screenSize.width, screenSize.height),
    [screenSize.width, screenSize.height],
  );

  const officeMembers = useMemo(
    () => getOfficeMembers(seats, officeCenter),
    [seats, officeCenter],
  );

  const remoteMembers = useMemo(
    () =>
      getRemoteMembers(
        constellations,
        officeMembers,
        screenSize.width,
        screenSize.height,
      ),
    [constellations, officeMembers, screenSize.width, screenSize.height],
  );

  const allMembersWithPositions: MemberWithPosition[] = useMemo(
    () => [...officeMembers, ...remoteMembers],
    [officeMembers, remoteMembers],
  );

  const connectedMemberIds = useMemo(
    () => getConnectedMemberIds(selectedMember, allMembersWithPositions),
    [selectedMember, allMembersWithPositions],
  );

  return (
    <div
      className="relative w-full h-full bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 overflow-hidden cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 背景星 */}
      <BackgroundStars />

      {/* 回転する惑星 */}
      <OrbitingPlanets />

      <ZoomControls
        zoomScale={zoomState.scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetZoom}
      />

      {/* ズーム可能なコンテンツ */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${zoomState.translateX}px, ${zoomState.translateY}px) scale(${zoomState.scale})`,
          transformOrigin: "center",
          transition: "none",
        }}
      >
        <div className="absolute inset-0">
          {seats.map((seat) => {
            const position = transformOfficeLayout(seat.position, officeCenter);
            return (
              <CompactSeat
                key={seat.id}
                seat={seat}
                position={position}
                scale={0.5}
              />
            );
          })}
        </div>

        <div className="absolute inset-0">
          {remoteMembers.map(({ member, position }) => (
            <RemoteMember
              key={member.id}
              member={member}
              position={position}
              isSelected={selectedMember?.id === member.id}
              isConnected={connectedMemberIds.includes(member.id)}
              onClick={() =>
                setSelectedMember(
                  selectedMember?.id === member.id ? undefined : member,
                )
              }
            />
          ))}
        </div>

        {/* プロジェクト連携線エフェクト */}
        {selectedMember && (
          <ProjectConnections
            selectedMember={selectedMember}
            allMembers={allMembersWithPositions}
          />
        )}
      </div>

      {/* ズーム対象外の固定UI要素 */}
      {/* メンバー詳細ツールチップ */}
      {selectedMember && (
        <MemberTooltip
          member={selectedMember}
          onClose={() => setSelectedMember(undefined)}
        />
      )}

      <Legend />
    </div>
  );
}
