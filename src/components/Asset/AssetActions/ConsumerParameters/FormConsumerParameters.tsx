import { ReactElement } from 'react'
import Input from '@shared/FormInput'
import Label from '@shared/FormInput/Label'
import { Field, useField } from 'formik'
import styles from './FormConsumerParameters.module.css'
import { ConsumerParameter, UserCustomParameters } from '@oceanprotocol/lib'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export function getDefaultValues(
  parameters: ConsumerParameter[]
): UserCustomParameters {
  const defaults = {}
  parameters?.forEach((param) => {
    Object.assign(defaults, {
      [param.name]:
        param.type === 'number'
          ? Number(param.default)
          : param.type === 'boolean'
          ? param.default.toString()
          : param.default
    })
  })

  return defaults
}

export default function FormConsumerParameters({
  name,
  parameters,
  disabled
}: {
  name: string
  parameters: ConsumerParameter[]
  disabled?: boolean
}): ReactElement {
  const [field] = useField<UserCustomParameters[]>(name)

  const getParameterOptions = (parameter: ConsumerParameter): string[] => {
    if (!parameter.options && parameter.type !== 'boolean') return []

    const updatedOptions =
      parameter.type === 'boolean'
        ? ['true', 'false']
        : parameter.type === 'select'
        ? JSON.parse(parameter.options)?.map((option) => {
            return {
              value: Object.keys(option)[0],
              label: Object.values(option)[0]
            }
          })
        : []

    // add empty option, if parameter is optional
    if (!parameter.required) updatedOptions.unshift('')

    return updatedOptions
  }

  return (
    <div className={styles.container}>
      <Label htmlFor="Input the consumer parameters">
        Input the consumer parameters
      </Label>
      <div
        className={cx({
          parametersContainer: true,
          parametersContainerDisabled: disabled
        })}
      >
        {parameters?.map((param) => {
          const { default: paramDefault, ...rest } = param

          return (
            <div key={param.name} className={styles.parameter}>
              <Field
                {...rest}
                component={Input}
                disabled={disabled}
                help={param.description}
                name={`${name}.${param.name}`}
                options={getParameterOptions(param)}
                size="small"
                type={param.type === 'boolean' ? 'select' : param.type}
                value={field.value[param.name]}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
