"use client";

import { motion } from "framer-motion";
import { Member } from "@/types";
import { MemberWithPosition, ConnectionLine } from "@/types/starmap";

interface ProjectConnectionsProps {
  selectedMember: Member;
  allMembers: MemberWithPosition[];
}

const ANIMATION_CONFIG = {
  connectionLine: {
    duration: 0.8,
    delayMultiplier: 0.3,
    ease: "easeInOut" as const,
  },
  pulseCircle: {
    duration: 2,
    ease: "easeInOut" as const,
  },
  projectLabel: {
    duration: 0.5,
    delay: 0.5,
  },
} as const;

const STYLE_CONFIG = {
  connectionLine: {
    stroke: "#3B82F6",
    strokeWidth: 2,
    strokeDasharray: "5,5",
    opacity: 0.7,
    glowColor: "#3B82F6",
  },
  pulseCircle: {
    radius: 40,
    stroke: "#3B82F6",
    strokeWidth: 2,
  },
  projectLabel: {
    offsetX: -40,
    offsetY: -85,
  },
} as const;

function getProjectMembers(
  selectedMember: Member,
  allMembers: MemberWithPosition[],
): MemberWithPosition[] {
  return allMembers.filter(
    ({ member }) => member.project === selectedMember.project,
  );
}

function reorderMembersFromSelected(
  projectMembers: MemberWithPosition[],
  selectedMember: Member,
): MemberWithPosition[] {
  const selectedIndex = projectMembers.findIndex(
    ({ member }) => member.id === selectedMember.id,
  );
  return [
    ...projectMembers.slice(selectedIndex),
    ...projectMembers.slice(0, selectedIndex),
  ];
}

function createConnectionLines(
  orderedMembers: MemberWithPosition[],
): ConnectionLine[] {
  return orderedMembers.slice(0, -1).map((fromMember, index) => ({
    from: fromMember,
    to: orderedMembers[index + 1],
    index,
  }));
}

export function ProjectConnections({
  selectedMember,
  allMembers,
}: ProjectConnectionsProps) {
  if (!selectedMember?.project) return null;

  const selectedMemberData = allMembers.find(
    (m) => m.member.id === selectedMember.id,
  );
  if (!selectedMemberData) return null;

  const projectMembers = getProjectMembers(selectedMember, allMembers);
  if (projectMembers.length <= 1) return null;

  const orderedMembers = reorderMembersFromSelected(
    projectMembers,
    selectedMember,
  );
  const connectionLines = createConnectionLines(orderedMembers);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full">
        {/* 光る効果のための定義 */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {connectionLines.map(({ from, to, index }) => {
          const pathId = `connection-${from.member.id}-${to.member.id}`;

          return (
            <g key={pathId}>
              {/* 光る背景線 */}
              <motion.line
                x1={from.position.x}
                y1={from.position.y}
                x2={to.position.x}
                y2={to.position.y}
                stroke={STYLE_CONFIG.connectionLine.glowColor}
                strokeWidth={4}
                filter="url(#glow)"
                initial={{
                  pathLength: 0,
                  opacity: 0,
                }}
                animate={{
                  pathLength: 1,
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: ANIMATION_CONFIG.connectionLine.duration,
                  delay:
                    index * ANIMATION_CONFIG.connectionLine.delayMultiplier,
                  ease: ANIMATION_CONFIG.connectionLine.ease,
                  opacity: {
                    duration: 4, // より長い周期でCPU負荷軽減
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                }}
              />
              {/* メイン線 */}
              <motion.line
                x1={from.position.x}
                y1={from.position.y}
                x2={to.position.x}
                y2={to.position.y}
                stroke={STYLE_CONFIG.connectionLine.stroke}
                strokeWidth={STYLE_CONFIG.connectionLine.strokeWidth}
                strokeDasharray={STYLE_CONFIG.connectionLine.strokeDasharray}
                initial={{
                  pathLength: 0,
                  opacity: 0,
                }}
                animate={{
                  pathLength: 1,
                  opacity: STYLE_CONFIG.connectionLine.opacity,
                }}
                transition={{
                  duration: ANIMATION_CONFIG.connectionLine.duration,
                  delay:
                    index * ANIMATION_CONFIG.connectionLine.delayMultiplier,
                  ease: ANIMATION_CONFIG.connectionLine.ease,
                }}
              />
            </g>
          );
        })}

        <motion.circle
          cx={selectedMemberData.position.x}
          cy={selectedMemberData.position.y}
          r={STYLE_CONFIG.pulseCircle.radius}
          fill="none"
          stroke={STYLE_CONFIG.pulseCircle.stroke}
          strokeWidth={STYLE_CONFIG.pulseCircle.strokeWidth}
          initial={{
            scale: 0,
            opacity: 0.8,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{
            duration: ANIMATION_CONFIG.pulseCircle.duration,
            repeat: Infinity,
            ease: ANIMATION_CONFIG.pulseCircle.ease,
          }}
        />
      </svg>

      <motion.div
        className="absolute bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
        style={{
          left:
            selectedMemberData.position.x + STYLE_CONFIG.projectLabel.offsetX,
          top:
            selectedMemberData.position.y + STYLE_CONFIG.projectLabel.offsetY,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ANIMATION_CONFIG.projectLabel.delay }}
      >
        {selectedMember.project}
      </motion.div>
    </div>
  );
}
