import { graphql, useStaticQuery } from 'gatsby'
import React, { ReactElement, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { OnboardingStep } from '..'
import { useWeb3 } from '../../../../../providers/Web3'
import { getErrorMessage } from '../../../../../utils/onboarding'
import StepActions from '../../../../organisms/Onboarding/StepActions'
import StepBody from '../../../../organisms/Onboarding/StepBody'
import StepHeader from '../../../../organisms/Onboarding/StepHeader'

const query = graphql`
  query ConnectAccountQuery {
    file(
      relativePath: { eq: "pages/index/onboarding/steps/connectAccount.json" }
    ) {
      childStepsJson {
        title
        subtitle
        body
        image {
          childImageSharp {
            original {
              src
            }
          }
        }
        buttonLabel
        buttonSuccess
      }
    }
  }
`

export default function ConnectAccount(): ReactElement {
  const data = useStaticQuery(query)
  const {
    title,
    subtitle,
    body,
    image,
    buttonLabel,
    buttonSuccess
  }: OnboardingStep = data.file.childStepsJson

  const { accountId, connect, web3Provider, networkId } = useWeb3()
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (accountId) {
      setCompleted(true)
    } else {
      setCompleted(false)
    }
  }, [accountId])

  const connectAccount = async () => {
    setLoading(true)
    try {
      await connect()
    } catch (error) {
      toast.error(
        getErrorMessage({
          accountId,
          web3Provider: !!web3Provider,
          networkId,
          balance: null
        })
      )
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <StepHeader title={title} subtitle={subtitle} />
      <StepBody body={body} image={image.childImageSharp.original.src}>
        <StepActions
          buttonLabel={buttonLabel}
          buttonAction={async () => await connectAccount()}
          successMessage={buttonSuccess}
          loading={loading}
          completed={completed}
        />
      </StepBody>
    </div>
  )
}
