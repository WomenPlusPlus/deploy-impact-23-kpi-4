import type { MenuProps } from 'antd'
import { frequency, roles } from '../types/types'

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
export const isGatekeeper = (role: string | undefined) => role === roles.GATEKEEPER

export const isEconomist = (role: string | undefined) => role === roles.ECONOMIST

const currentDate = new Date()
const currentMonth = currentDate.getMonth() + 1
const currentQuarter = Math.floor(currentMonth / 3) + 1

export const getDisplayedKpiPeriod = (name: string | undefined, year: number | undefined) => {
  let displayedPeriod = ''
  switch (name) {
  case frequency.MONTHLY:
    displayedPeriod = `M${currentMonth.toString().padStart(2, '0')} / ${year}`
    break
  case frequency.QUARTERLY:
    displayedPeriod = `Q${currentQuarter} / ${year}`
    break
  case frequency.YEARLY:
    displayedPeriod = year?.toString() || ''
  }

  return displayedPeriod
}
