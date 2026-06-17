import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AvatarProps {
  initials: string;
  gradient: string;
  size?: number;
}

export function Avatar({ initials, gradient, size = 48 }: AvatarProps) {
  const colors = parseGradient(gradient);
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-full items-center justify-center"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <Text className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
        {initials}
      </Text>
    </LinearGradient>
  );
}

function parseGradient(gradient: string): [string, string] {
  const match = gradient.match(/linear-gradient\([^,]+,\s*(#[0-9a-fA-F]+),\s*(#[0-9a-fA-F]+)\)/);
  if (match) return [match[1], match[2]];
  return ["#4a7eff", "#6c5ce7"];
}
