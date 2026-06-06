import {defineArrayMember, defineType} from 'sanity'
import {heroSection} from './heroSection'
import {featuresSection} from './featuresSection'
import {contentSection} from './contentSection'
import {carouselSection} from './carouselSection'
import {testimonialSection} from './testimonialSection'

export {heroSection, featuresSection, contentSection, carouselSection, testimonialSection}

/** Central modular page builder — stack sections in any order */
export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({type: 'heroSection'}),
    defineArrayMember({type: 'featuresSection'}),
    defineArrayMember({type: 'contentSection'}),
    defineArrayMember({type: 'carouselSection'}),
    // Legacy section types remain available on modular `page` documents
    defineArrayMember({type: 'sectionHero'}),
    defineArrayMember({type: 'sectionRichText'}),
    defineArrayMember({type: 'sectionFeatureGrid'}),
    defineArrayMember({type: 'sectionCardsGrid'}),
    defineArrayMember({type: 'sectionEngageBand'}),
    defineArrayMember({type: 'sectionFaq'}),
    defineArrayMember({type: 'sectionRelliaCta'}),
  ],
})
