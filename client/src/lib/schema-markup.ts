// Schema markup utilities for SEO

export interface CourseSchema {
  name: string;
  description: string;
  provider: string;
  image?: string;
  category?: string;
  url?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  instructor?: string;
  priceCurrency?: string;
  price?: number;
}

export function generateCourseSchema(course: CourseSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider || 'EduLearn',
      url: 'https://learnconnect.net'
    },
    ...(course.image && { image: course.image }),
    ...(course.category && { educationLevel: course.category }),
    ...(course.url && { url: course.url }),
    ...(course.level && { difficultLevel: course.level }),
    ...(course.duration && { duration: course.duration }),
    ...(course.instructor && { instructor: { '@type': 'Person', name: course.instructor } }),
    ...(course.price && {
      offers: {
        '@type': 'Offer',
        currency: course.priceCurrency || 'USD',
        price: course.price
      }
    })
  };

  return JSON.stringify(schema);
}

export function injectSchemaMarkup(schemaJson: string): void {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = schemaJson;
  document.head.appendChild(script);
}

export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contact?: {
    type: string;
    telephone?: string;
    email?: string;
  };
  sameAs?: string[];
}

export function generateOrganizationSchema(org: OrganizationSchema): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    ...(org.logo && { logo: org.logo }),
    ...(org.description && { description: org.description }),
    ...(org.contact && { contactPoint: org.contact }),
    ...(org.sameAs && { sameAs: org.sameAs })
  };

  return JSON.stringify(schema);
}

export interface BreadcrumbSchema {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbSchema): string {
  const itemListElement = breadcrumbs.items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };

  return JSON.stringify(schema);
}
