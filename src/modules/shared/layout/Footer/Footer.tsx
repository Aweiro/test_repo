import styles from './Footer.module.scss';
import Link from 'next/link';
import { Button } from '../../../../components/Button';
import { ButtonType } from '../../../../types/ButtonType';
import logo from '../../../../assets/img/Logo.svg';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className='container'>
        <div className={styles.footer__wrapper}>
          <Link href='/' className={styles.footer__logo}>
            <Image className={styles['footer__logo-img']} src={logo} alt='Logo' />
          </Link>

          <div className={styles.footer__nav}>
            <Link href='/' className={`uppercase-text ${styles.footer__link}`}>
              Github
            </Link>
            <Link href='/' className={`uppercase-text ${styles.footer__link}`}>
              Contacts
            </Link>
            <Link href='/' className={`uppercase-text ${styles.footer__link}`}>
              Rights
            </Link>
          </div>

          <div className={styles['footer__button-top']}>
            <p className={`small-text ${styles['footer__button-top-text']}`}>Back to top</p>
            <Button
              icon={ButtonType.Top}
              isRatio={true}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
