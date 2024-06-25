/* eslint-disable multiline-ternary */
import React, { FC, useContext } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom'
import * as dishAPI from '../../utils/api/dish-api'
import * as categoriesAPI from '../../utils/api/category-api'
import * as modifiersAPI from '../../utils/api/modifier-api'
import * as categoriesModifiersApi from '../../utils/api/category-modifier-api'
import {
  ECountry,
  TCategory,
  TCategoryModifier,
  TDish,
  TModifier,
  TRest
} from '../../utils/typesFromBackend'
import { Segmented } from 'antd'
import ModifiersForDish from '../../components/modifiers-for-dish/modifiers-for-dish'
import GroupModifiersForDish from '../../components/group-modifiers-for-dish/group-modifiers-for-dish'
import EditorDish from '../../components/editor-dish/editor-dish'
import { NotificationContext } from '../../components/notification-provider/notification-provider'

interface IDish {
  token: string
  rest: TRest
  t: (arg0: string) => string
  language: ECountry
}

const Dish: FC<IDish> = ({ token, rest, t, language }) => {
  const { openNotification } = useContext(NotificationContext)
  const pathname = useLocation().pathname
  const match = useRouteMatch(pathname)
  const dishId = Object.keys(match?.params as string)[0]
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const [dish, setDish] = React.useState<TDish>({} as TDish)
  const [allCategories, setAllCategories] = React.useState<TCategory[]>([])
  const [allModifiers, setAllModifiers] = React.useState<TModifier[]>([])
  const [allCategoryModifiers, setAllCategoryModifiers] = React.useState<
    TCategoryModifier[]
  >([])
  const [isDish, setIsDish] = React.useState(false)
  const [value, setValue] = React.useState<string | number>(t('dishes'))
  const [isFormChanged, setIsFormChanged] = React.useState(false)

  React.useEffect(() => {
    Promise.all([
      dishAPI.getDish(dishId),
      categoriesAPI.getListCategories(rest._id),
      modifiersAPI.getListModifiers(rest._id),
      categoriesModifiersApi.getListCategoriesModifiers(rest._id)
    ])
      .then(([res, categories, modifiers, categoriesModifiers]) => {
        setDish(res)
        setAllCategories(categories)
        setAllModifiers(modifiers)
        setAllCategoryModifiers(categoriesModifiers)
        const localStorageValue = window.localStorage.getItem('value')
        if (localStorageValue) {
          setValue(t(localStorageValue))
        } else {
          setValue(t('dishes'))
          window.localStorage.removeItem('value')
        }

        setIsDish(true)
      })
      .catch((e) => openNotification(e, 'topRight'))
  }, [language])

  React.useEffect(() => {
    return () => {
      window.localStorage.removeItem('value')
    }
  }, [])

  return (
    <>
      <h4
        style={{
          marginBottom: '15px',
          marginTop: '0',
          color: '#000',
          fontSize: '1.75rem',
          fontWeight: '600',
          padding: '15px'
        }}
      >
        {isDish && dish && dish.title ? dish.title[language] : ''}
      </h4>
      <Segmented
        block
        options={[
          t('dishes'),
          t('modifiers-for-dish'),
          t('group-modifiers-for-dish')
        ]}
        value={value}
        onChange={setValue}
      />{' '}
      {isDish ? (
        value === t('dishes') ? (
          <EditorDish
            key={language}
            allCategories={allCategories}
            token={token}
            rest={rest}
            t={t}
            language={language}
            isFormChanged={isFormChanged}
            setIsFormChanged={setIsFormChanged}
          />
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {isDish ? (
        value === t('modifiers-for-dish') ? (
          <ModifiersForDish
            data={allModifiers}
            dataAllCategoriesModifiers={allCategoryModifiers}
            token={token}
            rest={rest}
            t={t}
            language={language}
          />
        ) : (
          ''
        )
      ) : (
        ''
      )}
      {isDish ? (
        value === t('group-modifiers-for-dish') ? (
          <GroupModifiersForDish
            rest={rest}
            dataAllCategoriesModifiers={allCategoryModifiers}
            token={token}
            t={t}
            language={language}
          />
        ) : (
          ''
        )
      ) : (
        ''
      )}
    </>
  )
}
export default Dish
