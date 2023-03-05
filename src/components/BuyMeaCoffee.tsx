import Link from 'next/link';
import BuyMeaCoffeeSvg from '@svg/BuyMeaCoffeeSvg';
import styles from '@styles/Bmc.module.css';

/**
 * It renders a link to my Buy Me a Coffee page, with a coffee cup SVG inside it
 * @returns A div with a link to buy me a coffee.
 */
function BuyMeaCoffee(): JSX.Element {
  return (
    <div className={styles.container}>
      <Link
        href="https://www.buymeacoffee.com/ajaykanniyappan"
        title="Buy me a coffee"
        target="_blank"
        rel="noreferrer"
      >
        <BuyMeaCoffeeSvg className={styles.btn} />
      </Link>
    </div>
  );
}

export default BuyMeaCoffee;
