/**
 * AppIcon 图标注册表
 *
 * 所有前端项目通过 AppIcon 使用的图标必须在此注册。
 * 新增图标：确认 @iconify-icons/ep 中存在 → 在此 import 并加入 ICON_MAP → 本地验证。
 */
import type { IconifyIcon } from '@iconify/vue'

import HomeFilled from '@iconify-icons/ep/home-filled'
import Setting from '@iconify-icons/ep/setting'
import User from '@iconify-icons/ep/user'
import UserFilled from '@iconify-icons/ep/user-filled'
import Lock from '@iconify-icons/ep/lock'
import Key from '@iconify-icons/ep/key'
import Document from '@iconify-icons/ep/document'
import Files from '@iconify-icons/ep/files'
import Grid from '@iconify-icons/ep/grid'
import Odometer from '@iconify-icons/ep/odometer'
import Menu from '@iconify-icons/ep/menu'
import Connection from '@iconify-icons/ep/connection'
import Monitor from '@iconify-icons/ep/monitor'
import Medal from '@iconify-icons/ep/medal'
import Trophy from '@iconify-icons/ep/trophy'
import Platform from '@iconify-icons/ep/platform'
import Cpu from '@iconify-icons/ep/cpu'
import ChatDotRound from '@iconify-icons/ep/chat-dot-round'
import ChatLineRound from '@iconify-icons/ep/chat-line-round'
import ChatSquare from '@iconify-icons/ep/chat-square'
import Bell from '@iconify-icons/ep/bell'
import PictureFilled from '@iconify-icons/ep/picture-filled'
import Picture from '@iconify-icons/ep/picture'
import Edit from '@iconify-icons/ep/edit'
import EditPen from '@iconify-icons/ep/edit-pen'
import Pointer from '@iconify-icons/ep/pointer'
import Delete from '@iconify-icons/ep/delete'
import Search from '@iconify-icons/ep/search'
import Plus from '@iconify-icons/ep/plus'
import Refresh from '@iconify-icons/ep/refresh'
import Download from '@iconify-icons/ep/download'
import Upload from '@iconify-icons/ep/upload'
import View from '@iconify-icons/ep/view'
import Check from '@iconify-icons/ep/check'
import Close from '@iconify-icons/ep/close'
import Warning from '@iconify-icons/ep/warning'
import InfoFilled from '@iconify-icons/ep/info-filled'
import SuccessFilled from '@iconify-icons/ep/success-filled'
import ArrowRight from '@iconify-icons/ep/arrow-right'
import ArrowDown from '@iconify-icons/ep/arrow-down'
import ArrowUp from '@iconify-icons/ep/arrow-up'
import ArrowLeft from '@iconify-icons/ep/arrow-left'
import Back from '@iconify-icons/ep/back'
import Right from '@iconify-icons/ep/right'
import Fold from '@iconify-icons/ep/fold'
import Expand from '@iconify-icons/ep/expand'
import Loading from '@iconify-icons/ep/loading'
import MoreFilled from '@iconify-icons/ep/more-filled'
import VideoPlay from '@iconify-icons/ep/video-play'
import VideoPause from '@iconify-icons/ep/video-pause'
import FullScreen from '@iconify-icons/ep/full-screen'
import Position from '@iconify-icons/ep/position'
import Promotion from '@iconify-icons/ep/promotion'
import Clock from '@iconify-icons/ep/clock'
import CircleCheck from '@iconify-icons/ep/circle-check'
import CircleCheckFilled from '@iconify-icons/ep/circle-check-filled'
import CircleCloseFilled from '@iconify-icons/ep/circle-close-filled'
import QuestionFilled from '@iconify-icons/ep/question-filled'
import Rank from '@iconify-icons/ep/rank'
import Sort from '@iconify-icons/ep/sort'
import Timer from '@iconify-icons/ep/timer'
import Message from '@iconify-icons/ep/message'
import SetUp from '@iconify-icons/ep/set-up'
import SwitchButton from '@iconify-icons/ep/switch-button'
import CopyDocument from '@iconify-icons/ep/copy-document'
import Folder from '@iconify-icons/ep/folder'
import FolderAdd from '@iconify-icons/ep/folder-add'
import FolderRemove from '@iconify-icons/ep/folder-remove'
import List from '@iconify-icons/ep/list'
import Notebook from '@iconify-icons/ep/notebook'
import RefreshRight from '@iconify-icons/ep/refresh-right'
import RefreshLeft from '@iconify-icons/ep/refresh-left'
import DocumentCopy from '@iconify-icons/ep/document-copy'
import Calendar from '@iconify-icons/ep/calendar'
import Link from '@iconify-icons/ep/link'
import Share from '@iconify-icons/ep/share'
import Star from '@iconify-icons/ep/star'
import Comment from '@iconify-icons/ep/comment'
import Phone from '@iconify-icons/ep/phone'
import VideoCamera from '@iconify-icons/ep/video-camera'
import House from '@iconify-icons/ep/house'
import MagicStick from '@iconify-icons/ep/magic-stick'
import Operation from '@iconify-icons/ep/operation'
import DataLine from '@iconify-icons/ep/data-line'
import PieChart from '@iconify-icons/ep/pie-chart'
import DataBoard from '@iconify-icons/ep/data-board'
import TrendCharts from '@iconify-icons/ep/trend-charts'
import Histogram from '@iconify-icons/ep/histogram'
import Crop from '@iconify-icons/ep/crop'
import Location from '@iconify-icons/ep/location'
import Aim from '@iconify-icons/ep/aim'
import CaretTop from '@iconify-icons/ep/caret-top'
import CaretBottom from '@iconify-icons/ep/caret-bottom'
import Minus from '@iconify-icons/ep/minus'
import Iphone from '@iconify-icons/ep/iphone'
import Cellphone from '@iconify-icons/ep/cellphone'
import OfficeBuilding from '@iconify-icons/ep/office-building'
import Stamp from '@iconify-icons/ep/stamp'
import Wallet from '@iconify-icons/ep/wallet'
import Money from '@iconify-icons/ep/money'
import ShoppingCart from '@iconify-icons/ep/shopping-cart'
import CreditCard from '@iconify-icons/ep/credit-card'
import Coin from '@iconify-icons/ep/coin'
import Collection from '@iconify-icons/ep/collection'
import Tools from '@iconify-icons/ep/tools'
import DocumentChecked from '@iconify-icons/ep/document-checked'
import Box from '@iconify-icons/ep/box'
import AlarmClock from '@iconify-icons/ep/alarm-clock'
import TakeawayBox from '@iconify-icons/ep/takeaway-box'
import Coordinate from '@iconify-icons/ep/coordinate'
import Postcard from '@iconify-icons/ep/postcard'
import DataAnalysis from '@iconify-icons/ep/data-analysis'
import Reading from '@iconify-icons/ep/reading'

/** 图标名称 → Iconify 图标对象映射（AppIcon 唯一合法来源） */
export const ICON_MAP: Record<string, IconifyIcon> = {
  'home-filled': HomeFilled,
  setting: Setting,
  user: User,
  'user-filled': UserFilled,
  lock: Lock,
  key: Key,
  document: Document,
  files: Files,
  grid: Grid,
  odometer: Odometer,
  menu: Menu,
  connection: Connection,
  monitor: Monitor,
  medal: Medal,
  trophy: Trophy,
  platform: Platform,
  cpu: Cpu,
  'chat-dot-round': ChatDotRound,
  'chat-line-round': ChatLineRound,
  'chat-square': ChatSquare,
  bell: Bell,
  'picture-filled': PictureFilled,
  picture: Picture,
  edit: Edit,
  'edit-pen': EditPen,
  pointer: Pointer,
  delete: Delete,
  search: Search,
  plus: Plus,
  refresh: Refresh,
  download: Download,
  upload: Upload,
  view: View,
  check: Check,
  close: Close,
  warning: Warning,
  'info-filled': InfoFilled,
  'success-filled': SuccessFilled,
  success: SuccessFilled,
  'arrow-right': ArrowRight,
  'arrow-down': ArrowDown,
  'arrow-up': ArrowUp,
  'arrow-left': ArrowLeft,
  back: Back,
  right: Right,
  fold: Fold,
  expand: Expand,
  loading: Loading,
  'more-filled': MoreFilled,
  'video-play': VideoPlay,
  'video-pause': VideoPause,
  'full-screen': FullScreen,
  position: Position,
  promotion: Promotion,
  clock: Clock,
  'circle-check': CircleCheck,
  'circle-check-filled': CircleCheckFilled,
  'circle-close-filled': CircleCloseFilled,
  'question-filled': QuestionFilled,
  rank: Rank,
  sort: Sort,
  timer: Timer,
  message: Message,
  'set-up': SetUp,
  'switch-button': SwitchButton,
  'copy-document': CopyDocument,
  copy: CopyDocument,
  folder: Folder,
  'folder-add': FolderAdd,
  'folder-remove': FolderRemove,
  list: List,
  notebook: Notebook,
  'refresh-right': RefreshRight,
  'refresh-left': RefreshLeft,
  'document-copy': DocumentCopy,
  calendar: Calendar,
  link: Link,
  share: Share,
  star: Star,
  comment: Comment,
  phone: Phone,
  'video-camera': VideoCamera,
  house: House,
  'magic-stick': MagicStick,
  operation: Operation,
  'data-line': DataLine,
  'pie-chart': PieChart,
  'data-board': DataBoard,
  'trend-charts': TrendCharts,
  histogram: Histogram,
  crop: Crop,
  location: Location,
  aim: Aim,
  'caret-top': CaretTop,
  'caret-bottom': CaretBottom,
  minus: Minus,
  iphone: Iphone,
  cellphone: Cellphone,
  'office-building': OfficeBuilding,
  stamp: Stamp,
  wallet: Wallet,
  money: Money,
  'shopping-cart': ShoppingCart,
  'credit-card': CreditCard,
  coin: Coin,
  collection: Collection,
  tools: Tools,
  'document-checked': DocumentChecked,
  box: Box,
  'alarm-clock': AlarmClock,
  'takeaway-box': TakeawayBox,
  coordinate: Coordinate,
  postcard: Postcard,
  'data-analysis': DataAnalysis,
  reading: Reading,
}

/** 已注册图标名称列表（kebab-case） */
export const APP_ICON_NAMES = Object.keys(ICON_MAP).sort() as readonly string[]

export type AppIconName = keyof typeof ICON_MAP

export function isRegisteredAppIcon(name: string): name is AppIconName {
  return name in ICON_MAP
}
