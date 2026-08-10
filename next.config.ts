import type { NextConfig } from "next";

function normalizeBasePath(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || trimmed === "/") return undefined;

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

const appBasePath = normalizeBasePath(process.env.APP_BASE_PATH);

const nextConfig: NextConfig = {
  basePath: appBasePath,
};

export default nextConfig;
