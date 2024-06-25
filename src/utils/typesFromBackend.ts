export interface TButton {
  _id: string
  title: IMultiLang
  active: boolean
}

export interface TUser {
  _id: string
  nickname?: string
  birthdate?: string
  name?: string
  phone: string
  street?: string
  house?: string
  flat?: string
  city?: TCity
  smsCode?: string
  timeSendCode?: string
}
export interface TOrder {
  _id: string
  incomingOrderId: number
  orderStatusId: string
  check: boolean
  numberTable?: string
  spotId?: string
  hide?: boolean
  orderPrice: number
  isPaid: boolean
  datetime: string
  comment: string
  place?: number
  delivery_detail?: {
    city?: string
    street?: string
    house?: string
    flat?: string
  }
  orderType_id: TOrderType | string
  deliveryPrice?: number
  payment_id: TPayment | string
  user_id: TUser | string
  userPhone: string
  userCode?: string
  rest_id: TRest | string
  orderList: TCartInitialState
  customInputs: TCustomInputsOrder[]
  creation_date: string
}
export interface TCustomInputsOrder {
  name: string
  value: string
}
export interface TCartInitialState {
  dishes: TDishInCart[]
}
export interface TDishInCart {
  dish: TDish
  quantity: number
  id: string
}
export interface TOrderType {
  _id: string
  title: IMultiLang
  active: boolean
  isDelivery: boolean
}

export interface TOrderStatus {
  _id: string
  title: IMultiLang
  active: boolean
  isEndedStatus: boolean
}

export interface TCity {
  _id?: string
  title: string
  deliveryPrice: number
  minSummOrder: number
  deliveryFree: boolean
}

export interface TColor {
  _id: string
  mainTextColor: string
  mainColor: string
  buttonTextColor: string
  buttonColor: string
  loght: string
  textLight: string
  stroke: string
  orderMadeBlock: string
  backgroundColor: string
  popupBackup: string
  popupInputColor: string
  useLoaderImage: string | null
  useBackgroundImg: string | null
  viewGrid: boolean
  leftMenuBgColor: string
  borderButtonColor: string
  borderInputColor: string
}

export interface TTerm {
  _id: string
  juryAddress: string
  physicalAddress: string
  emailAddress: string
  phoneNumber: string
  shortName: string
  webSite: string
  bankDetails: string
  juryName: string
  INN: string
  OGRN: string
  addr_index: string
}

export enum ETariff {
  Trial = 'Trial',
  Basic = 'Basic',
  Extend = 'Extend',
  Pro = 'Pro',
  Vip = 'Vip'
}

export interface TPayment {
  _id: string
  title: any
  active: boolean
  paymentPublicID: string
}

export interface TSocialNetworks {
  _id: string
  title: string
  link: string
  active: boolean
  image: string
}
export interface TRest {
  _id: string
  titleRest: string
  countTable: number
  currentCurrency: string
  titleTable: string
  enableDishesQr: boolean
  tariff: ETariff
  adminCode: string
  waiterCode: string
  telegramBotName: string
  yandexMetrika: string
  isIntegrationWithIiko: boolean
  NameIiko: string
  NameRestaurant: string
  payments_ids: TPayment[]
  enableTips: boolean
  tipsLayoutID: string
  enableBooking: boolean
  openTime: string
  closeTime: string
  logoPath: string
  workPhone: string
  workAddress: string
  buttons_ids: TButton[] | []
  orderType_ids: TOrderType[]
  orderStatus_ids: TOrderStatus[]
  colorsSchema_id: TColor
  pathRest: string
  city_ids: TCity[]
  terms_ids: TTerm
  enableSms: boolean
  defaultOrderStatus_id: string
  enableDateDelivery: boolean
  country: ECountry
  incomingOrderId?: number
  customInput_ids: TCustomInput[]
  paymentPublicID: string | null
  singleMessagePayment: boolean
  isAdult: boolean
  languages: string[]
  paymentTypes: string[]
  social_ids: TSocialNetworks[] | []
  rkepper_id: string
  rkeeper_order_use: boolean
}

export enum ECountry {
  RU = 'RU',
  KZ = 'KZ',
  EN = 'EN'
}

export interface IMultiLang {
  [ECountry.RU]: string
  [ECountry.EN]?: string
  [ECountry.KZ]?: string
}
export interface TSale {
  _id: string
  action: boolean
  title: string
  description: string
  image: string
  dateStartSales: string
  dateFinishSales: string
  rest_id: string
}
export interface TCategoryModifier {
  _id: string
  active: boolean
  title: IMultiLang
  sort: number
  categoryModifiers_id: TCategoryModifier | string
  modifiers_ids: TModifier[]
  idFromIiko: string
  isGroupModifierCategoryRadio: boolean
  isGroupModifierRequired: boolean
}
export interface TModifier {
  _id: string
  title: IMultiLang
  active: boolean
  image: string
  sort: number
  price: number
  categoryModifier: string
  unit: string
  weight: number
  description: IMultiLang
  idFromIiko: string
}

export interface TCategory {
  _id: string
  active: boolean
  category_id: TCategory | string | null
  idFromIiko: string
  noImagesCategory: boolean
  sort: number
  title: IMultiLang
  typeMenu_id: string
  rest_id: TRest | string
}
export interface TDish {
  _id: string
  title: IMultiLang
  active: boolean
  image: string
  imageQr: string
  sort: number
  price: number
  category_id: TCategory
  unit: string
  weight: number
  description: IMultiLang
  descriptionId: string
  colorQr: string
  fontFamilyQr: string
  idFromIiko: string
  modifiers_ids: TModifier[]
  groupModifiers_ids: TCategoryModifier[]
  rest_id: TRest | string
  crossSaleDish_ids: TSale[] | string[]
}
export interface TSubCategories {
  subcategories: TSubCategories[] | []
  category: TCategory
  dishes: TDish[] | []
}
export interface TCustomInput {
  _id: string
  name: string
  placeholder: IMultiLang
  label: IMultiLang
  required: boolean
}
export interface TAdmin {
  _id?: string
  nickname: string
  password: string
  rest_id?: TRest | string
}
