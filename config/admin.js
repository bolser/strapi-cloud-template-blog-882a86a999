module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env('CLIENT_URL'),
      async handler(uid, { documentId, locale, status }) {
        // Map each previewable content type to the FE URL path that renders
        // it. Add a new entry here when a new content type goes live with a
        // public page (e.g. Article → `/news/${slug}`).
        const pathFor = {
          'api::page.page': (slug) => `/${slug}`,
          'api::location.location': (slug) => `/locations/${slug}`,
        };
        const buildPath = pathFor[uid];
        if (!buildPath) return null;

        const doc = await strapi.documents(uid).findOne({ documentId, locale });
        if (!doc) return null;

        const params = new URLSearchParams({
          secret: env('PREVIEW_SECRET'),
          previewStatus: status,
          locale,
        });
        return `${env('CLIENT_URL')}${buildPath(doc.slug)}?${params.toString()}`;
      },
    },
  },
});
