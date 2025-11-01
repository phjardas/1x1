interface AvatarProps {
  mood?: "happy" | "excited" | "encouraging" | "celebrating";
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function Avatar({
  mood = "happy",
  size = "medium",
  className = "",
}: AvatarProps) {
  const sizeClasses = {
    small: "w-20 h-20",
    medium: "w-32 h-32",
    large: "w-40 h-40",
  };

  const animations = {
    happy: "animate-float",
    excited: "animate-bounce-in",
    encouraging: "animate-pulse-scale",
    celebrating: "animate-bounce",
  };

  return (
    <div className={`${sizeClasses[size]} ${animations[mood]} ${className}`}>
      <svg
        viewBox="0 0 200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Body */}
        <ellipse cx="100" cy="180" rx="45" ry="60" fill="#F4A460" />

        {/* Spots on body */}
        <ellipse cx="85" cy="170" rx="10" ry="12" fill="#D2691E" opacity="0.6" />
        <ellipse cx="110" cy="190" rx="8" ry="10" fill="#D2691E" opacity="0.6" />
        <ellipse cx="100" cy="210" rx="9" ry="11" fill="#D2691E" opacity="0.6" />

        {/* Neck */}
        <rect x="85" y="80" width="30" height="100" rx="15" fill="#F4A460" />

        {/* Spots on neck */}
        <ellipse cx="92" cy="100" rx="7" ry="9" fill="#D2691E" opacity="0.6" />
        <ellipse cx="108" cy="120" rx="6" ry="8" fill="#D2691E" opacity="0.6" />
        <ellipse cx="95" cy="140" rx="8" ry="10" fill="#D2691E" opacity="0.6" />
        <ellipse cx="105" cy="160" rx="7" ry="9" fill="#D2691E" opacity="0.6" />

        {/* Head */}
        <ellipse cx="100" cy="60" rx="35" ry="30" fill="#F4A460" />

        {/* Ears */}
        <ellipse cx="75" cy="45" rx="8" ry="12" fill="#F4A460" />
        <ellipse cx="125" cy="45" rx="8" ry="12" fill="#F4A460" />
        <ellipse cx="75" cy="45" rx="5" ry="8" fill="#FFE4B5" />
        <ellipse cx="125" cy="45" rx="5" ry="8" fill="#FFE4B5" />

        {/* Ossicones (horns) */}
        <rect x="80" y="30" width="6" height="15" rx="3" fill="#8B4513" />
        <rect x="114" y="30" width="6" height="15" rx="3" fill="#8B4513" />
        <circle cx="83" cy="30" r="4" fill="#654321" />
        <circle cx="117" cy="30" r="4" fill="#654321" />

        {/* Snout */}
        <ellipse cx="100" cy="75" rx="20" ry="15" fill="#FFE4B5" />

        {/* Nostrils */}
        <ellipse cx="92" cy="75" rx="3" ry="4" fill="#8B4513" />
        <ellipse cx="108" cy="75" rx="3" ry="4" fill="#8B4513" />

        {/* Eyes */}
        <circle cx="85" cy="55" r="8" fill="white" />
        <circle cx="115" cy="55" r="8" fill="white" />
        <circle cx="87" cy="55" r="5" fill="#654321" />
        <circle cx="117" cy="55" r="5" fill="#654321" />
        <circle cx="89" cy="53" r="2" fill="white" opacity="0.8" />
        <circle cx="119" cy="53" r="2" fill="white" opacity="0.8" />

        {/* Smile */}
        <path
          d="M 90 68 Q 100 72 110 68"
          stroke="#8B4513"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Legs */}
        <rect x="75" y="230" width="12" height="45" rx="6" fill="#F4A460" />
        <rect x="113" y="230" width="12" height="45" rx="6" fill="#F4A460" />

        {/* Hooves */}
        <ellipse cx="81" cy="273" rx="8" ry="5" fill="#654321" />
        <ellipse cx="119" cy="273" rx="8" ry="5" fill="#654321" />

        {/* Tail */}
        <path
          d="M 145 190 Q 160 200 155 220"
          stroke="#F4A460"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 153 218 L 158 228 L 148 225 Z"
          fill="#8B4513"
        />
      </svg>
    </div>
  );
}

export function AvatarGreeting({ name = "Greta" }: { name?: string }) {
  return (
    <div className="text-center">
      <Avatar mood="happy" size="large" className="mx-auto mb-4" />
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
          Hallo! Ich bin {name}!
        </h2>
        <p className="text-lg text-slate-700">
          Ich freue mich, dass du heute mit mir üben möchtest! 🦒
        </p>
      </div>
    </div>
  );
}

export function AvatarFarewell({
  name = "Greta",
  mood = "celebrating",
  message,
}: {
  name?: string;
  mood?: "happy" | "excited" | "encouraging" | "celebrating";
  message: string;
}) {
  return (
    <div className="text-center mb-4">
      <Avatar mood={mood} size="medium" className="mx-auto mb-3" />
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 shadow-sm">
        <p className="text-xl font-semibold text-slate-800 mb-2">
          {name} sagt:
        </p>
        <p className="text-lg text-slate-700 italic">"{message}"</p>
      </div>
    </div>
  );
}
