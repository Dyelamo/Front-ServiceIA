import { useWindowDimensions } from "react-native";

import { layout } from "../../theme";

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const { tablet, desktop, largeDesktop } = layout.breakpoints;

  const isMobile = width < tablet;

  const isTablet = width >= tablet && width < desktop;

  const isDesktop = width >= desktop;

  const isLargeDesktop = width >= largeDesktop;

  return {
    width,
    height,

    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
}

export default useResponsive;
