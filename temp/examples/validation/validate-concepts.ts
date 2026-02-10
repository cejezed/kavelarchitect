// scripts/validate-concepts.ts
// Validatie script voor content governance
// Run met: npx tsx scripts/validate-concepts.ts

import { getAllConcepts, getConcept } from '../lib/kb-concepts'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface ValidationError {
  file: string
  concept: string
  error: string
  line?: number
}

const CURRENT_SITE: 'abjz' | 'kavelarchitect' | 'brikx' = 'abjz' // Change per project

/**
 * Valideer alle MDX/MD files in content directory
 */
async function validateContent(contentDir: string): Promise<ValidationError[]> {
  const errors: ValidationError[] = []
  const concepts = await getAllConcepts()
  
  // Get all MDX/MD files
  const files = getAllMDXFiles(contentDir)
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const { content: markdownContent } = matter(content)
    
    // Check each concept
    for (const concept of concepts) {
      const regex = new RegExp(concept.term, 'gi')
      const matches = markdownContent.match(regex)
      
      if (!matches) continue
      
      // Check if concept is linked
      const linkRegex = new RegExp(`\\[${concept.term}\\]\\(.*?\\)`, 'gi')
      const hasLink = linkRegex.test(markdownContent)
      
      // If not owner and no link, error
      if (concept.owner_site !== CURRENT_SITE && !hasLink) {
        errors.push({
          file,
          concept: concept.term,
          error: `Begrip "${concept.term}" gebruikt maar niet gelinkt. Eigenaar: ${concept.owner_site}`,
        })
      }
      
      // Check for definition headers if not owner
      if (concept.owner_site !== CURRENT_SITE) {
        const definitionHeaderRegex = new RegExp(`^##?\\s+(Wat (zijn|is)|Het begrip)\\s+${concept.term}`, 'im')
        if (definitionHeaderRegex.test(markdownContent)) {
          errors.push({
            file,
            concept: concept.term,
            error: `H1/H2 "Wat is ${concept.term}" niet toegestaan (niet eigenaar)`,
          })
        }
      }
      
      // Check sentence count (rough estimate)
      if (concept.owner_site !== CURRENT_SITE) {
        const conceptParagraphs = markdownContent.split(/\n\n+/).filter(p => 
          p.includes(concept.term)
        )
        
        const totalSentences = conceptParagraphs.reduce((count, p) => {
          return count + p.split(/[.!?]+/).length
        }, 0)
        
        const rules = concept.rules_json[CURRENT_SITE]
        if (rules?.max_sentences && totalSentences > rules.max_sentences * 2) {
          errors.push({
            file,
            concept: concept.term,
            error: `Te veel tekst over ${concept.term} (~${totalSentences} zinnen, max ${rules.max_sentences} toegestaan)`,
          })
        }
      }
    }
  }
  
  return errors
}

/**
 * Get all MDX/MD files recursively
 */
function getAllMDXFiles(dir: string): string[] {
  const files: string[] = []
  
  if (!fs.existsSync(dir)) {
    return files
  }
  
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      files.push(...getAllMDXFiles(fullPath))
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      files.push(fullPath)
    }
  }
  
  return files
}

/**
 * Check for concepts without canonical URL
 */
async function checkConceptIntegrity(): Promise<string[]> {
  const issues: string[] = []
  const concepts = await getAllConcepts()
  
  for (const concept of concepts) {
    if (!concept.canonical_url || concept.canonical_url.trim() === '') {
      issues.push(`Concept "${concept.term}" (${concept.slug}) heeft geen canonical URL`)
    }
    
    if (!concept.definition_short || concept.definition_short.trim() === '') {
      issues.push(`Concept "${concept.term}" (${concept.slug}) heeft geen korte definitie`)
    }
    
    if (!concept.owner_site) {
      issues.push(`Concept "${concept.term}" (${concept.slug}) heeft geen eigenaar`)
    }
  }
  
  return issues
}

/**
 * Main validation runner
 */
async function main() {
  console.log('🔍 Validating content governance...\n')
  
  // Check concept integrity
  console.log('📋 Checking concept integrity...')
  const integrityIssues = await checkConceptIntegrity()
  
  if (integrityIssues.length > 0) {
    console.log(`❌ Found ${integrityIssues.length} integrity issues:`)
    integrityIssues.forEach(issue => console.log(`  - ${issue}`))
    console.log()
  } else {
    console.log('✅ All concepts have required fields\n')
  }
  
  // Validate content
  const contentDir = process.argv[2] || './content' // Pass content dir as argument
  console.log(`📝 Validating content in ${contentDir}...`)
  
  const contentErrors = await validateContent(contentDir)
  
  if (contentErrors.length > 0) {
    console.log(`❌ Found ${contentErrors.length} content validation errors:`)
    contentErrors.forEach(error => {
      console.log(`\n  File: ${error.file}`)
      console.log(`  Concept: ${error.concept}`)
      console.log(`  Error: ${error.error}`)
    })
    console.log()
    process.exit(1)
  } else {
    console.log('✅ All content is valid\n')
  }
  
  console.log('✨ Validation complete!')
}

main().catch(console.error)

// Usage:
// npx tsx scripts/validate-concepts.ts ./content
// Or add to package.json:
// "scripts": {
//   "validate": "tsx scripts/validate-concepts.ts ./content"
// }
