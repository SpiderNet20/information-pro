import { DownloadAppItem } from '../data/downloadsApps';

export interface AppBreadcrumbItem {
  name: string;
  href: string;
}

export function getAppBreadcrumbs(app: DownloadAppItem): AppBreadcrumbItem[] {
  const isGame = app.filterKey === 'games';
  const appName = app.arabicName || app.name;
  const appHref = `/Downloads/${app.slug}`;

  if (isGame) {
    return [
      { name: 'تحميلات', href: '/Downloads/' },
      { name: 'ألعاب', href: '/Downloads/' },
      { name: appName, href: appHref },
    ];
  }

  const platform = app.platform || 'أندرويد';
  return [
    { name: 'تطبيقات', href: '/Downloads/' },
    { name: platform, href: '/Downloads/' },
    { name: appName, href: appHref },
  ];
}
