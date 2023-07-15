import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Future Trading System'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    //${}反单引号中字符串拼接，不需要'+'
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
