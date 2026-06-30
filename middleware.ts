import { isItemDetailPathname } from "./shared/cms/itemDetailSeo"

const SOCIAL_BOT_PATTERN =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|WhatsApp|Discordbot|Pinterest|TelegramBot|Googlebot|bingbot/i

export default async function middleware(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? ""
  if (!SOCIAL_BOT_PATTERN.test(userAgent)) {
    return
  }

  const url = new URL(request.url)
  const pathname = url.pathname.replace(/\/+$/, "") || "/"
  if (!isItemDetailPathname(pathname)) {
    return
  }

  url.pathname = "/api/social-html"
  url.searchParams.set("path", pathname)

  return Response.redirect(url.toString(), 307)
}

export const config = {
  matcher: [
    "/stories/:path*",
    "/founders/alumni/:path*",
    "/advisors/directory/:path*",
    "/careers/roles/:path*",
    "/events/:path*",
    "/programs/:path*",
  ],
}
