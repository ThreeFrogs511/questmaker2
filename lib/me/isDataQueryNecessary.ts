
interface isDataLoadedType {
  isPlayerDataLoaded?: boolean;
  isInventoryDataLoaded?: boolean;
  isUserDataLoaded?: boolean;
  isQuestDataLoaded?: boolean;
};


export default function isDatabaseQueryNecessary(
  pathname: string,
  isDataLoaded: isDataLoadedType,
  questsAreLoaded: boolean,
) {
  if (
    pathname === "/journal" &&
    questsAreLoaded &&
    isDataLoaded.isPlayerDataLoaded
  )
    return false;
  if (
    (pathname === "/characterSheet" || pathname === "/profileSettings") &&
    isDataLoaded.isPlayerDataLoaded
  )
    return false;
  if (
    (pathname === "/inventory" || pathname.includes("/merchant")) &&
    isDataLoaded.isPlayerDataLoaded &&
    isDataLoaded.isInventoryDataLoaded
  ) {
    return false;
  }
  if (
    (pathname === "/launcher" || pathname.includes("/campaignRunning")) &&
    isDataLoaded.isPlayerDataLoaded &&
    isDataLoaded.isInventoryDataLoaded
  ) {
    return false;
  }
}
