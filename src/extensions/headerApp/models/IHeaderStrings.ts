export interface IHeaderStrings {
  Title: string;
  NavigationLabel: string;
  OverviewLabel: string;
  CurrentPageLabel: string;
  CurrentSectionLabel: string;
  SectionCountSingleLabel: string;
  SectionCountLabel: string;
  ChromeFallbackLabel: string;
  OpenMenuLabel: string;
  CloseMenuLabel: string;
  LoadingLabel: string;
  HomeAriaLabel: string;
  BackButtonLabel: string;
  ViewAllLabel: string;
  FeaturedLabel: string;
  SkipToNavigationLabel: string;
  SubmenuAriaLabel: string;
  MobileBreadcrumbsAriaLabel: string;
  SkipNavigationTargetAriaLabel: string;
  NavigationUnavailableLabel: string;
  EmptySectionLabel: string;
  /**
   * Optional template used to give "View all" links unique context for screen readers.
   * {0} is replaced with the section or item label.
   */
  ViewAllForLabel?: string;
  // Feature labels
  SearchPlaceholder?: string;
  SearchAriaLabel?: string;
  SearchSuggestionsLabel?: string;
  RecentSearchesLabel?: string;
  UserMenuAriaLabel?: string;
  NotificationsAriaLabel?: string;
  NotificationsEmptyLabel?: string;
  AppLauncherAriaLabel?: string;
  QuickActionsAriaLabel?: string;
  LanguageSwitcherAriaLabel?: string;
  ThemeLightLabel?: string;
  ThemeDarkLabel?: string;
  BookmarksAriaLabel?: string;
  AdminSettingsAriaLabel?: string;
  HelpAriaLabel?: string;
  SiteSwitcherAriaLabel?: string;
  FeedbackAriaLabel?: string;
  PrintAriaLabel?: string;
  ShareAriaLabel?: string;
  BackToTopAriaLabel?: string;
  AccessibilityToolsAriaLabel?: string;
  HighContrastLabel?: string;
  TextSizeLabel?: string;
  BreadcrumbsAriaLabel: string;
  BookmarksEmptyLabel: string;
  MyProfileLabel: string;
  SignOutLabel: string;
}