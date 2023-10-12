import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number];

export const getMenuItems = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick? :() => void,
  children?: MenuItem[],
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    onClick
  } as MenuItem
}

export const getURL = () => {
  let url =
        process.env.REACT_APP_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

  return url
}