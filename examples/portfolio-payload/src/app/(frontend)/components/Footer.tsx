import { getPayload } from 'payload'

import config from '@/payload.config'

const SOCIALS = [
  ['Discord', 'social-discord.svg'],
  ['Facebook', 'social-facebook.svg'],
  ['Dribbble', 'social-dribbble.svg'],
  ['Instagram', 'social-instagram.svg'],
  ['Behance', 'social-behance.svg'],
] as const

export async function Footer() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return (
    <footer className="footer section" id="contact">
      <div className="footer__inner">
        <div className="footer__left">
          <div className="footer__message">
            <h2>{settings.footerHeading}</h2>
            <p>{settings.footerBody}</p>
          </div>
          <div className="footer__social">
            {SOCIALS.map(([label, file]) => (
              <a key={label} href="#" aria-label={label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/assets/${file}`} alt="" width={36} height={36} />
              </a>
            ))}
          </div>
        </div>
        <form className="footer__right" action="#" method="post">
          <div className="footer__fields">
            <input type="text" name="name" placeholder="Name" aria-label="Name" />
            <input type="email" name="email" placeholder="Email" aria-label="Email" />
            <textarea name="message" placeholder="Type your message here" aria-label="Message" />
          </div>
          <button className="footer__submit" type="submit">
            Submit
          </button>
        </form>
      </div>
    </footer>
  )
}
