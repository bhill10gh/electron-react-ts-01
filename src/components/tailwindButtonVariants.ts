export const buttonBase =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium leading-5 shadow-sm transition-colors focus:outline-none focus:ring-4";

const gradientBase = `${buttonBase} text-center text-white focus:ring-offset-0`;
const borderedBase = `${buttonBase} border-2 bg-white focus:ring-offset-0`;

export const tailwindButtonVariants = {
  default: `${buttonBase} border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300`,
  secondary: `${buttonBase} border border-gray-300 bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-200`,
  tertiary: `${buttonBase} border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-200`,
  success: `${buttonBase} border border-transparent bg-green-600 text-white hover:bg-green-700 focus:ring-green-300`,
  danger: `${buttonBase} border border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-300`,
  warning: `${buttonBase} border border-transparent bg-amber-400 text-gray-900 hover:bg-amber-500 focus:ring-amber-200`,
  dark: `${buttonBase} border border-transparent bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-400`,
  ghost: `${buttonBase} border border-transparent bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-200`,

  "gradient-purple-blue": `${gradientBase} bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:ring-blue-300`,
  "gradient-cyan-blue": `${gradientBase} bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:ring-cyan-300`,
  "gradient-green-blue": `${gradientBase} bg-gradient-to-br from-green-400 to-blue-600 hover:from-green-500 hover:to-blue-700 focus:ring-green-200`,
  "gradient-purple-pink": `${gradientBase} bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:ring-purple-200`,
  "gradient-pink-orange": `${gradientBase} bg-gradient-to-br from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 focus:ring-pink-200`,
  "gradient-teal-lime": `${gradientBase} bg-gradient-to-r from-teal-200 to-lime-200 text-gray-900 hover:from-teal-300 hover:to-lime-300 focus:ring-lime-200`,
  "gradient-red-yellow": `${gradientBase} bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 text-gray-900 hover:from-red-300 hover:to-yellow-300 focus:ring-red-100`,

  "shadow-blue": `${gradientBase} bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/50 hover:brightness-110 focus:ring-blue-300`,
  "shadow-green": `${gradientBase} bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-lg shadow-green-500/50 hover:brightness-110 focus:ring-green-300`,
  "shadow-cyan": `${gradientBase} bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/50 hover:brightness-110 focus:ring-cyan-300`,
  "shadow-teal": `${gradientBase} bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 shadow-lg shadow-teal-500/50 hover:brightness-110 focus:ring-teal-300`,
  "shadow-lime": `${gradientBase} bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 text-gray-900 shadow-lg shadow-lime-500/50 hover:brightness-105 focus:ring-lime-300`,
  "shadow-red": `${gradientBase} bg-gradient-to-r from-red-400 via-red-500 to-red-600 shadow-lg shadow-red-500/50 hover:brightness-110 focus:ring-red-300`,

  "bordered-brand": `${borderedBase} border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-200`,
  "bordered-gray": `${borderedBase} border-gray-400 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200`,
  "bordered-success": `${borderedBase} border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-200`,
  "bordered-danger": `${borderedBase} border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-200`,
  "bordered-warning": `${borderedBase} border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white focus:ring-amber-200`,
} as const;

export type TailwindButtonVariant = keyof typeof tailwindButtonVariants;

export const tailwindButtonShowcase: {
  title: string;
  buttons: { variant: TailwindButtonVariant; label: string }[];
}[] = [
  {
    title: "Default buttons",
    buttons: [
      { variant: "default", label: "Default" },
      { variant: "secondary", label: "Secondary" },
      { variant: "tertiary", label: "Tertiary" },
      { variant: "success", label: "Success" },
      { variant: "danger", label: "Danger" },
      { variant: "warning", label: "Warning" },
      { variant: "dark", label: "Dark" },
      { variant: "ghost", label: "Ghost" },
    ],
  },
  {
    title: "Gradient duotone",
    buttons: [
      { variant: "gradient-purple-blue", label: "Purple to Blue" },
      { variant: "gradient-cyan-blue", label: "Cyan to Blue" },
      { variant: "gradient-green-blue", label: "Green to Blue" },
      { variant: "gradient-purple-pink", label: "Purple to Pink" },
      { variant: "gradient-pink-orange", label: "Pink to Orange" },
      { variant: "gradient-teal-lime", label: "Teal to Lime" },
      { variant: "gradient-red-yellow", label: "Red to Yellow" },
    ],
  },
  {
    title: "Colored shadows",
    buttons: [
      { variant: "shadow-blue", label: "Blue" },
      { variant: "shadow-green", label: "Green" },
      { variant: "shadow-cyan", label: "Cyan" },
      { variant: "shadow-teal", label: "Teal" },
      { variant: "shadow-lime", label: "Lime" },
      { variant: "shadow-red", label: "Red" },
    ],
  },
  {
    title: "Colored borders",
    buttons: [
      { variant: "bordered-brand", label: "Brand" },
      { variant: "bordered-gray", label: "Gray" },
      { variant: "bordered-success", label: "Success" },
      { variant: "bordered-danger", label: "Danger" },
      { variant: "bordered-warning", label: "Warning" },
    ],
  },
];