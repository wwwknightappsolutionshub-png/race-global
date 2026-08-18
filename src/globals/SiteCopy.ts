import type { GlobalConfig } from 'payload'

export const SiteCopy: GlobalConfig = {
  slug: 'site-copy',
  label: 'Page copy',
  admin: {
    description: 'All public page text. Edit here — no code required.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Home',
          fields: [
            { name: 'homeKicker', type: 'text', defaultValue: 'RGT-00 · Trade corridor' },
            {
              name: 'homeIntro',
              type: 'textarea',
              defaultValue:
                "Race General Trading LLC is a Dubai-based international commodity trading company connecting Africa's agricultural resources with buyers across the Middle East, Asia, Europe, and other global markets.",
            },
            { name: 'homeCta', type: 'text', defaultValue: 'Contact us' },
            {
              name: 'cargoKicker',
              type: 'text',
              defaultValue: 'Cargo',
              admin: { description: 'Small gold label above the cargo heading.' },
            },
            {
              name: 'cargoHeading',
              type: 'text',
              defaultValue: 'Cargo on the book',
            },
            {
              name: 'cargoIntro',
              type: 'textarea',
              defaultValue:
                'We specialize in the international sourcing and export of high-quality agricultural commodities from African origin through Dubai.',
            },
            {
              name: 'heroOriginImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Left side of the homepage corridor — origin / farm.' },
            },
            {
              name: 'heroHubImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Right side of the homepage corridor — Dubai / trade hub.' },
            },
            {
              name: 'heroOriginGallery',
              type: 'array',
              labels: { singular: 'Origin slide', plural: 'Origin slides (fade)' },
              admin: {
                description: 'Extra origin photos. The main origin image plus these fade in and out.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
            {
              name: 'heroHubGallery',
              type: 'array',
              labels: { singular: 'Hub slide', plural: 'Hub slides (fade)' },
              admin: {
                description: 'Extra Dubai / hub photos. The main hub image plus these fade in and out.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'About',
          fields: [
            { name: 'aboutKicker', type: 'text', defaultValue: 'RGT-01 · Company dossier' },
            { name: 'aboutHeading', type: 'text', defaultValue: 'A sourcing partner, not a one-off shipment.' },
            {
              name: 'aboutBody',
              type: 'textarea',
              defaultValue:
                "Built on integrity, reliability, and long-term partnerships, we specialize in sourcing, exporting, and supplying premium agricultural commodities directly from trusted producers across Nigeria, Kenya, Egypt, Rwanda, and other strategic African markets.\n\nOur extensive supplier network, rigorous quality standards, and efficient logistics enable us to deliver products that consistently meet international specifications. More than a trading company, we are a dependable sourcing partner committed to helping businesses secure high-quality agricultural products with confidence.\n\nAt Race General Trading, we don't simply move products — we create lasting business relationships built on trust, transparency, and value.",
            },
            { name: 'aboutImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'What we do',
          fields: [
            { name: 'workKicker', type: 'text', defaultValue: 'RGT-02 · Scope of work' },
            {
              name: 'workIntro',
              type: 'textarea',
              defaultValue:
                'Race General Trading delivers end-to-end agricultural commodity trading solutions, connecting African producers with international buyers through a reliable and efficient supply chain. From sourcing to export documentation and logistics coordination, we manage every stage so clients receive quality products on schedule and at competitive market prices.',
            },
            {
              name: 'sourcingTitle',
              type: 'text',
              defaultValue: 'Agricultural commodity sourcing',
            },
            {
              name: 'sourcingBody',
              type: 'textarea',
              defaultValue:
                'We source premium agricultural commodities directly from carefully selected farms, cooperatives, and certified suppliers across Africa, ensuring consistent quality and competitive pricing.',
            },
            {
              name: 'exportTitle',
              type: 'text',
              defaultValue: 'Export & supply chain management',
            },
            {
              name: 'exportBody',
              type: 'textarea',
              defaultValue:
                'We manage export documentation, quality inspections, packaging, logistics coordination, customs compliance, and international shipping to ensure smooth delivery from origin to destination.',
            },
            { name: 'sourcingImage', type: 'upload', relationTo: 'media' },
            { name: 'exportImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Process',
          fields: [
            { name: 'processKicker', type: 'text', defaultValue: 'RGT-04 · Why our process works' },
            {
              name: 'processIntro',
              type: 'textarea',
              defaultValue:
                'Every shipment moves through eight gates. Each one is a control point — enquiry, specification, supplier, price, inspection, documents, logistics, and delivery support.',
            },
          ],
        },
        {
          label: 'Why us',
          fields: [
            {
              name: 'reasons',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'contactKicker', type: 'text', defaultValue: 'RGT-05 · Open a trade file' },
            { name: 'contactHeading', type: 'text', defaultValue: "Let's build lasting trade partnerships." },
            {
              name: 'contactBody',
              type: 'textarea',
              defaultValue:
                "Whether you're looking for a dependable supplier, consistent product quality, or a trusted sourcing partner across Africa, Race General Trading is ready to support your business. Get in touch today to discuss your sourcing requirements.",
            },
          ],
        },
        {
          label: 'Privacy',
          fields: [
            {
              name: 'privacyBody',
              type: 'textarea',
              defaultValue:
                'Race General Trading LLC collects only the information you submit through our enquiry form — company details, contact data, and sourcing requirements — so we can respond to your request. We do not sell personal data. To update or remove an enquiry, email contact@racegentrade.com.',
            },
          ],
        },
      ],
    },
  ],
}
