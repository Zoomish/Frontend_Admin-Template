/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { FC, useContext } from 'react'
import { Link, NavLink, useLocation, useRouteMatch } from 'react-router-dom'
import {
  ECountry,
  TDishInCart,
  TOrder,
  TRest,
  TUser
} from '../../utils/typesFromBackend'
import * as ordersApi from '../../utils/api/order-api'
import * as restApi from '../../utils/api/rest-api'
import * as userApi from '../../utils/api/user-api'
import Table, { ColumnsType } from 'antd/es/table'
import { Popconfirm, Select } from 'antd'
import { DeleteTwoTone, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import imageNoPhoto from '../../assets/images/no_photo.png'
import { v4 as makeUUID } from 'uuid'
import { BASE_URL_CDN } from '../../utils/const'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IDataType {
  image: string
  title: string
  quantity: number
  price: number
  id: string
  key: React.ReactNode
  children?: IDataType[]
}

interface IOption {
  value: string | number
  label: string
  children?: IOption[]
}

interface IOrder {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const Order: FC<IOrder> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const orderId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [orderData, SetOrderData] = React.useState<TOrder>({} as TOrder)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [user, setUser] = React.useState<TUser>({} as TUser)
  const [listStatusForOrder, setListStatusForOrder] = React.useState<IOption[]>(
    []
  )
  const [orderListData, setOrderListData] = React.useState<IDataType[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [place, setPlace] = React.useState('')
  const [payment, setPayment] = React.useState('')

  React.useEffect(() => {
    Promise.all([ordersApi.getOrder(orderId, token), restApi.getRest(rest._id)])
      .then(([order, rest]: [TOrder, TRest]) => {
        const arrayOptionsStatus: IOption[] = []
        rest.orderStatus_ids.forEach((status) => {
          arrayOptionsStatus.push({
            value: status._id,
            label: status.title[language] ?? ''
          })
        })
        setListStatusForOrder(arrayOptionsStatus)
        rest.orderType_ids.forEach((status) => {
          if (status._id === order.orderType_id) {
            setPlace(status.title[language] as string)
          }
        })
        SetOrderData(order)
        const arrayDishes: IDataType[] = []
        order.orderList.dishes.forEach((item) => {
          if (item.dish.modifiers_ids.length > 0) {
            let titleDishPlusModifiers = item.dish.title[language] as string
            let priceDish = item.dish.price
            item.dish.modifiers_ids.forEach((modifier) => {
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              titleDishPlusModifiers += '\n' + '  - ' + modifier.title[language]
              priceDish += modifier.price
            })
            arrayDishes.push({
              image: item.dish.image,
              title: titleDishPlusModifiers,
              quantity: item.quantity,
              price: priceDish,
              id: item.dish._id,
              key: item.id
            })
          } else {
            arrayDishes.push({
              image: item.dish.image,
              title: item.dish.title[language] as string,
              quantity: item.quantity,
              price: item.dish.price,
              id: item.dish._id,
              key: item.id
            })
          }
        })
        rest.payments_ids.forEach((paym) => {
          if (paym._id === order.payment_id) {
            setPayment(paym.title[language])
          }
        })
        setOrderListData(arrayDishes)
        if (typeof order.user_id === 'string') {
          userApi
            .getUser(order.user_id, token)
            .then((person: TUser) => {
              setUser(person)
              setIsLoading(true)
            })
            .catch((e) => openNotification(e, 'topRight'))
        } else {
          setUser(order.user_id)
          setIsLoading(true)
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [])

  function handleDeleteDish (record: any): void {
    const arrayDishesInCart: TDishInCart[] = []
    let priceDish = 0
    orderData.orderList.dishes.forEach((dish) => {
      if (dish.id === record.key) {
        priceDish += dish.dish.price
        dish.dish.modifiers_ids.forEach((modificator) => {
          priceDish += modificator.price
        })
        priceDish = priceDish * dish.quantity
      } else {
        arrayDishesInCart.push(dish)
      }
    })
    const updateOrder = { ...orderData }
    updateOrder.orderList.dishes = arrayDishesInCart
    updateOrder.orderPrice -= priceDish
    updateOrder.orderPrice = Math.round(updateOrder.orderPrice * 100) / 100
    ordersApi
      .updateOrder(updateOrder, token)
      .then((res) => {
        SetOrderData(res)
        if (res._id) {
          const arrayDishes: IDataType[] = []
          orderListData.forEach((dish) => {
            if (dish.id !== record.id) {
              arrayDishes.push({ ...dish })
            }
          })
          setOrderListData(arrayDishes)
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function increaseQuantity (record: any): void {
    const arrayDishesInCart: TDishInCart[] = []
    let priceDish = 0
    orderData.orderList.dishes.forEach((dish) => {
      if (dish.id === record.key) {
        dish.quantity += 1
        priceDish += dish.dish.price
        dish.dish.modifiers_ids.forEach((modificator) => {
          priceDish += modificator.price
        })
        arrayDishesInCart.push(dish)
      } else {
        arrayDishesInCart.push(dish)
      }
    })
    const updateOrder = { ...orderData }
    updateOrder.orderList.dishes = arrayDishesInCart
    updateOrder.orderPrice += priceDish
    updateOrder.orderPrice = Math.round(updateOrder.orderPrice * 100) / 100
    ordersApi
      .updateOrder(updateOrder, token)
      .then((res) => {
        SetOrderData(res)
        if (res._id) {
          const arrayDishes: IDataType[] = []
          orderListData.forEach((dish) => {
            if (dish.id === record.id) {
              arrayDishes.push({ ...dish, quantity: dish.quantity + 1 })
            } else {
              arrayDishes.push({ ...dish })
            }
          })
          setOrderListData(arrayDishes)
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }

  function decreaseQuantity (record: any): void {
    // нужно сначала делать запрос
    if (record.quantity > 1) {
      const arrayDishesInCart: TDishInCart[] = []
      let priceDish = 0
      orderData.orderList.dishes.forEach((dish) => {
        if (dish.id === record.key) {
          priceDish += dish.dish.price
          dish.dish.modifiers_ids.forEach((modificator) => {
            priceDish += modificator.price
          })
          dish.quantity -= 1
          arrayDishesInCart.push(dish)
        } else {
          arrayDishesInCart.push(dish)
        }
      })
      const updateOrder = { ...orderData }
      updateOrder.orderList.dishes = arrayDishesInCart
      updateOrder.orderPrice -= priceDish
      updateOrder.orderPrice = Math.round(updateOrder.orderPrice * 100) / 100
      ordersApi
        .updateOrder(updateOrder, token)
        .then((res) => {
          SetOrderData(res)
          if (res._id) {
            const arrayDishes: IDataType[] = []
            orderListData.forEach((dish) => {
              if (dish.id === record.id) {
                arrayDishes.push({ ...dish, quantity: dish.quantity - 1 })
              } else {
                arrayDishes.push({ ...dish })
              }
            })
            setOrderListData(arrayDishes)
          }
        })
        .catch((e) => openNotification(e, 'topRight'))
    } else {
      const arrayDishesInCart: TDishInCart[] = []
      let priceDish = 0
      orderData.orderList.dishes.forEach((dish) => {
        if (dish.id === record.key) {
          priceDish += dish.dish.price
          dish.dish.modifiers_ids.forEach((modificator) => {
            priceDish += modificator.price
          })
        } else {
          arrayDishesInCart.push(dish)
        }
      })
      const updateOrder = { ...orderData }
      updateOrder.orderList.dishes = arrayDishesInCart
      updateOrder.orderPrice -= priceDish
      updateOrder.orderPrice = Math.round(updateOrder.orderPrice * 100) / 100
      ordersApi
        .updateOrder(updateOrder, token)
        .then((res) => {
          SetOrderData(res)
          if (res._id) {
            const arrayDishes: IDataType[] = []
            orderListData.forEach((dish) => {
              if (dish.id !== record.id) {
                arrayDishes.push({ ...dish })
              }
            })
            setOrderListData(arrayDishes)
          }
        })
        .catch((e) => openNotification(e, 'topRight'))
    }
  }

  const columns: ColumnsType<IDataType> = [
    {
      title: `${t('image')}`,
      dataIndex: 'image',
      key: 'image',
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      render: (image) =>
        image
          ? (
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          <img
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            src={`${BASE_URL_CDN}/${image}`}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
            )
          : (
          <img
            src={imageNoPhoto}
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
            )
    },
    {
      title: `${t('order-composition')}`,
      dataIndex: 'title',
      key: 'title',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (title) => <p>{title}</p>
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record: { id: React.Key }) => (
        <Popconfirm
          title={t('increase-number')}
          onConfirm={() => increaseQuantity(record)}
        >
          <PlusOutlined />
        </Popconfirm>
      )
    },
    {
      title: `${t('quantity')}`,
      dataIndex: 'quantity',
      key: 'quantity',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (quantity) => <p>{quantity}</p>
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record: { id: React.Key }) => (
        <Popconfirm
          title={t('decrease-number')}
          onConfirm={() => decreaseQuantity(record)}
        >
          <MinusOutlined />
        </Popconfirm>
      )
    },
    {
      title: `${t('price')}`,
      dataIndex: 'price',
      key: 'price',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      render: (id, dish) => (
        <p>{Math.round(dish.price * dish.quantity * 100) / 100}</p>
      )
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record: { id: React.Key }) => (
        <Popconfirm
          title={t('delete-permanently')}
          onConfirm={() => handleDeleteDish(record)}
        >
          <DeleteTwoTone />
        </Popconfirm>
      )
    }
  ]

  function handleChange (value: string): void {
    const updateOrder = { ...orderData }
    updateOrder.orderStatusId = value
    ordersApi
      .updateOrder(updateOrder, token)
      .then((res) => {
        if (res._id) {
          SetOrderData(res)
        }
      })
      .catch((e) => openNotification(e, 'topRight'))
  }
  return (
    <>
      {isLoading
        ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              marginBottom: '1rem',
              alignItems: 'center',
              outline: 'none',
              padding: '0'
            }}
          >
            <div style={{ display: 'block', marginRight: 'auto' }}>
              <h2 style={{ fontWeight: 600, marginBottom: '0' }}>
                {t('order-no')}
                {orderData.incomingOrderId}
              </h2>
              <Link
                to={`/${rest.pathRest}/orders`}
                style={{ marginBottom: '0' }}
              >
                {t('list-orders')}
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  color: '#fff',
                  borderColor: '#2bc155',
                  width: '145px',
                  height: '61px',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Select
                  options={listStatusForOrder}
                  defaultValue={orderData.orderStatusId}
                  style={{ width: '100%' }}
                  onChange={handleChange}
                />
              </div>
              <NavLink
                to={`/${rest.pathRest}/edit-order`}
                style={{
                  color: '#fff',
                  backgroundColor: '#2bc155',
                  borderColor: '#2bc155',
                  width: '145px',
                  height: '61px',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px',
                  marginLeft: '10px'
                }}
              >
                {t('add-in-order')}
              </NavLink>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div
              style={{ width: '20%', display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{
                  color: '#fff',
                  backgroundColor: '#2bc155',
                  borderColor: '#2bc155',
                  width: '90%',
                  height: '61px',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxWidth: '145px'
                }}
              >
                {place}
              </div>
              <p
                style={{
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  marginBottom: '10px',
                  marginTop: '15px'
                }}
              >
                {t('details-order')}
              </p>
              {user ? user.name ? <p>{user.name}</p> : '' : ''}
              <p>{orderData.userPhone}</p>
              {orderData.deliveryPrice
                ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <p
                    style={{
                      fontWeight: '500',
                      fontSize: '1rem',
                      marginBottom: '10px'
                    }}
                  >
                    {t('delivery-cost')}
                  </p>
                  <p>{orderData.deliveryPrice}</p>
                  <p
                    style={{
                      fontWeight: '500',
                      fontSize: '1rem',
                      marginBottom: '10px'
                    }}
                  >
                    {t('address')}
                  </p>
                  {orderData.delivery_detail?.city
                    ? (
                    <p>{orderData.delivery_detail.city}</p>
                      )
                    : (
                        ''
                      )}
                  {orderData.delivery_detail?.street
                    ? (
                    <p>{orderData.delivery_detail.street}</p>
                      )
                    : (
                        ''
                      )}
                  {orderData.delivery_detail?.house
                    ? (
                    <p>{orderData.delivery_detail.house}</p>
                      )
                    : (
                        ''
                      )}
                  {orderData.delivery_detail?.flat
                    ? (
                    <p>{orderData.delivery_detail.flat}</p>
                      )
                    : (
                        ''
                      )}
                </div>
                  )
                : (
                    ''
                  )}
              <p
                style={{
                  fontWeight: '500',
                  fontSize: '1rem',
                  marginBottom: '10px'
                }}
              >
                {t('order-time')}
              </p>
              {orderData.datetime === 'yes'
                ? (
                <p>{t('nearest-time')}</p>
                  )
                : (
                <p>
                  {new Date(Number(orderData.datetime)).toLocaleDateString(
                    'ru-RU'
                  )}
                </p>
                  )}
              <p
                style={{
                  fontWeight: '500',
                  fontSize: '1rem',
                  marginBottom: '10px'
                }}
              >
                {t('method-payment')}
              </p>
              <p>{payment}</p>
              {orderData.isPaid ? <p>{t('order-is-paid')}</p> : ''}
              {orderData.customInputs.length > 0
                ? orderData.customInputs.map((input) => (
                    <div
                      style={{ display: 'flex', flexDirection: 'column' }}
                      key={makeUUID()}
                    >
                      <p>{input.name}</p>
                      <p>{input.value}</p>
                    </div>
                ))
                : ''}
              {orderData.comment ? <p>{orderData.comment}</p> : ''}
            </div>
            <Table
              columns={columns}
              dataSource={orderListData}
              style={{ whiteSpace: 'pre', width: '100%' }}
            />
          </div>
        </div>
          )
        : (
            ''
          )}
    </>
  )
}
export default Order
