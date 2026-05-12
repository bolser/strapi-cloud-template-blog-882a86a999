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
        if (uid !== 'api::page.page') return null;
        const doc = await strapi.documents(uid).findOne({ documentId, locale });
        if (!doc) return null;
        const params = new URLSearchParams({
          secret: env('PREVIEW_SECRET'),
          previewStatus: status,
          locale,
        });
        return `${env('CLIENT_URL')}/${doc.slug}?${params.toString()}`;
      },
    },
  },
});
