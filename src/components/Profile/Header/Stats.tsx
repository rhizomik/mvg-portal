import { ReactElement } from 'react'
import NumberUnit from './NumberUnit'
import styles from './Stats.module.css'
import { useProfile } from '@context/Profile'

export default function Stats(): ReactElement {
  const { assetsTotal, sales, pendingConsents, totalConsents } = useProfile()

  return (
    <div className={styles.stats}>
      <NumberUnit
        label={`Sale${sales === 1 ? '' : 's'}`}
        value={typeof sales !== 'number' || sales < 0 ? 0 : sales}
      />
      <NumberUnit label="Published" value={assetsTotal} />
      <NumberUnit label="Pending Consents" value={pendingConsents ?? -1} />
      <NumberUnit label="Total Consents" value={totalConsents ?? -1} />
    </div>
  )
}
