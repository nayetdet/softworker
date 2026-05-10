import type { ArraySectionDefinition } from '@/types/resume/sections/array/array-section-definition'
import type { FieldDefinition } from '@/types/resume/fields/field-definition'
import type { NestedSectionDefinition } from '@/types/resume/sections/object/nested-section-definition'
import type { ObjectSectionDefinition } from '@/types/resume/sections/object/object-section-definition'
import type { SectionDefinition } from '@/types/resume/sections/shared/section-definition'
import { getPathKey } from '@/mappers/resume/path.mapper'
import { FORM_SECTIONS } from '@/services/resume-form.service'
import type { ResumeLanguage } from '@/types/ui/resume-language'

export type UiStrings = {
  addItemAria: string
  addItemTitle: string
  arrayItemCountOne: string
  arrayItemCountOther: string
  arraySectionEmpty: string
  arraySectionHint: string
  downloadJson: string
  downloadPdf: string
  languageLabel: string
  languageNames: Record<ResumeLanguage, string>
  listTitle: string
  listEmptyDescription: string
  listEmptyTitle: string
  listPlaceholder: string
  listRemoveAriaPrefix: string
  listRemoveButton: string
  modeDescription: string
  modeLabel: string
  modeForm: string
  modeSource: string
  workspaceDescription: string
  workspaceTitle: string
  previewEyebrow: string
  previewDescription: string
  previewEmpty: string
  previewTitle: string
  previewFrameTitle: string
  repoAriaLabel: string
  resetAriaLabel: string
  resetConfirm: string
  resetTitle: string
  sourceEditorAriaLabel: string
  sourceInvalidJsonPrefix: string
  statusTitle: string
  validationIssueOne: string
  validationIssueOther: string
  validationAdjustOne: string
  validationAdjustOther: string
  reviewPendingLabel: string
}

const UI_STRINGS: Record<ResumeLanguage, UiStrings> = {
  pt_BR: {
    addItemAria: 'Adicionar {item}',
    addItemTitle: 'Adicionar {item}',
    arrayItemCountOne: 'item',
    arrayItemCountOther: 'itens',
    arraySectionEmpty: 'Nenhum item ainda. Use o botão `+` para adicionar o primeiro.',
    arraySectionHint: 'Use um item por linha nos campos de lista.',
    downloadJson: 'Baixar JSON',
    downloadPdf: 'Baixar PDF',
    languageLabel: 'Idioma',
    languageNames: {
      pt_BR: 'Português (Brasil)',
      en_US: 'Inglês (EUA)',
    },
    listTitle: 'Itens da lista',
    listEmptyDescription: 'Use o campo acima para criar a lista. Espaços dentro do item continuam intactos.',
    listEmptyTitle: 'Nenhum item adicionado ainda.',
    listPlaceholder: 'Digite um item e pressione Enter',
    listRemoveAriaPrefix: 'Remover {item}',
    listRemoveButton: 'Remover',
    modeDescription: 'Escolha entre formulário estruturado e fonte JSON',
    modeLabel: 'Modo de edição',
    modeForm: 'Formulário',
    modeSource: 'JSON',
    workspaceDescription: 'Edite os dados e acompanhe o documento final sem sair da mesma tela.',
    workspaceTitle: 'Editor de currículos',
    previewEyebrow: 'Pré-visualização',
    previewDescription: 'A visualização acompanha o estado válido mais recente do currículo.',
    previewEmpty: 'A pré-visualização aparece aqui assim que o currículo for renderizado.',
    previewTitle: 'Currículo em PDF',
    previewFrameTitle: 'Pré-visualização do currículo',
    repoAriaLabel: 'Abrir repositório do SoftWorker no GitHub',
    resetAriaLabel: 'Resetar progresso',
    resetConfirm: 'Resetar o progresso salvo deste currículo?',
    resetTitle: 'Resetar progresso',
    sourceEditorAriaLabel: 'Fonte JSON do currículo',
    sourceInvalidJsonPrefix: 'JSON inválido:',
    statusTitle: 'Status',
    validationIssueOne: 'issue',
    validationIssueOther: 'issues',
    validationAdjustOne: 'ajuste pendente',
    validationAdjustOther: 'ajustes pendentes',
    reviewPendingLabel: 'Revisão pendente',
  },
  en_US: {
    addItemAria: 'Add {item}',
    addItemTitle: 'Add {item}',
    arrayItemCountOne: 'item',
    arrayItemCountOther: 'items',
    arraySectionEmpty: 'No items yet. Use the `+` button to add the first one.',
    arraySectionHint: 'Use one item per line in list fields.',
    downloadJson: 'Download JSON',
    downloadPdf: 'Download PDF',
    languageLabel: 'Language',
    languageNames: {
      pt_BR: 'Portuguese (Brazil)',
      en_US: 'English (US)',
    },
    listTitle: 'List items',
    listEmptyDescription: 'Use the field above to create the list. Spaces inside each item are preserved.',
    listEmptyTitle: 'No items added yet.',
    listPlaceholder: 'Type an item and press Enter',
    listRemoveAriaPrefix: 'Remove {item}',
    listRemoveButton: 'Remove',
    modeDescription: 'Choose between the structured form and JSON source',
    modeLabel: 'Edit mode',
    modeForm: 'Form',
    modeSource: 'JSON',
    workspaceDescription: 'Edit the data and track the final document without leaving the same screen.',
    workspaceTitle: 'Resume editor',
    previewEyebrow: 'Preview',
    previewDescription: 'The preview follows the latest valid state of the resume.',
    previewEmpty: 'The preview appears here as soon as the resume is rendered.',
    previewTitle: 'Resume PDF',
    previewFrameTitle: 'Resume preview',
    repoAriaLabel: 'Open the SoftWorker repository on GitHub',
    resetAriaLabel: 'Reset progress',
    resetConfirm: 'Reset the saved progress for this resume?',
    resetTitle: 'Reset progress',
    sourceEditorAriaLabel: 'Resume JSON source',
    sourceInvalidJsonPrefix: 'Invalid JSON:',
    statusTitle: 'Status',
    validationIssueOne: 'issue',
    validationIssueOther: 'issues',
    validationAdjustOne: 'pending fix',
    validationAdjustOther: 'pending fixes',
    reviewPendingLabel: 'Pending review',
  },
}

const SECTION_TITLES: Record<ResumeLanguage, Record<string, string>> = {
  pt_BR: {
    basics: 'Informações básicas',
    meta: 'Metadados',
    profiles: 'Perfis',
    skills: 'Habilidades',
    work: 'Experiência profissional',
    volunteer: 'Voluntariado',
    projects: 'Projetos',
    education: 'Formação',
    certificates: 'Certificados',
    languages: 'Idiomas',
    awards: 'Prêmios',
    publications: 'Publicações',
    interests: 'Interesses',
    references: 'Referências',
    location: 'Localização',
  },
  en_US: {
    basics: 'Basic information',
    meta: 'Metadata',
    profiles: 'Profiles',
    skills: 'Skills',
    work: 'Work experience',
    volunteer: 'Volunteer work',
    projects: 'Projects',
    education: 'Education',
    certificates: 'Certificates',
    languages: 'Languages',
    awards: 'Awards',
    publications: 'Publications',
    interests: 'Interests',
    references: 'References',
    location: 'Location',
  },
}

const ITEM_TITLES: Record<ResumeLanguage, Record<string, string>> = {
  pt_BR: {
    'basics.profiles': 'Perfil',
    skills: 'Habilidade',
    work: 'Experiência',
    volunteer: 'Experiência voluntária',
    projects: 'Projeto',
    education: 'Formação',
    certificates: 'Certificado',
    languages: 'Idioma',
    awards: 'Prêmio',
    publications: 'Publicação',
    interests: 'Interesse',
    references: 'Referência',
  },
  en_US: {
    'basics.profiles': 'Profile',
    skills: 'Skill',
    work: 'Experience',
    volunteer: 'Volunteer experience',
    projects: 'Project',
    education: 'Education',
    certificates: 'Certificate',
    languages: 'Language',
    awards: 'Award',
    publications: 'Publication',
    interests: 'Interest',
    references: 'Reference',
  },
}

const ARRAY_SECTION_TITLES: Record<ResumeLanguage, Record<string, string>> = {
  pt_BR: {
    'basics.profiles': 'Perfis',
    skills: 'Habilidades',
    work: 'Experiência profissional',
    volunteer: 'Voluntariado',
    projects: 'Projetos',
    education: 'Formação',
    certificates: 'Certificados',
    languages: 'Idiomas',
    awards: 'Prêmios',
    publications: 'Publicações',
    interests: 'Interesses',
    references: 'Referências',
  },
  en_US: {
    'basics.profiles': 'Profiles',
    skills: 'Skills',
    work: 'Work experience',
    volunteer: 'Volunteer work',
    projects: 'Projects',
    education: 'Education',
    certificates: 'Certificates',
    languages: 'Languages',
    awards: 'Awards',
    publications: 'Publications',
    interests: 'Interests',
    references: 'References',
  },
}

const FIELD_LABELS: Record<ResumeLanguage, Record<string, string>> = {
  pt_BR: {
    address: 'Endereço',
    area: 'Área',
    awarder: 'Concedido por',
    canonical: 'Canonical',
    city: 'Cidade',
    countryCode: 'País',
    courses: 'Cursos',
    date: 'Data',
    description: 'Descrição',
    email: 'E-mail',
    endDate: 'Fim',
    entity: 'Entidade',
    fluency: 'Fluência',
    highlights: 'Destaques',
    image: 'Foto',
    institution: 'Instituição',
    keywords: 'Palavras-chave',
    label: 'Título',
    language: 'Idioma',
    lastModified: 'Última atualização',
    level: 'Nível',
    location: 'Local',
    name: 'Nome',
    network: 'Rede',
    note: 'Nota',
    organization: 'Organização',
    phone: 'Telefone',
    postalCode: 'CEP',
    position: 'Cargo',
    profiles: 'Perfis',
    publisher: 'Publicador',
    region: 'Região',
    reference: 'Texto',
    releaseDate: 'Data de publicação',
    required: 'Obrigatório',
    roles: 'Papéis',
    score: 'Nota',
    self: 'Resumo',
    skills: 'Habilidades',
    startDate: 'Início',
    studyType: 'Tipo de curso',
    summary: 'Resumo',
    title: 'Título',
    type: 'Tipo',
    url: 'URL',
    username: 'Usuário',
    version: 'Versão',
  },
  en_US: {
    address: 'Address',
    area: 'Area',
    awarder: 'Awarded by',
    canonical: 'Canonical',
    city: 'City',
    countryCode: 'Country',
    courses: 'Courses',
    date: 'Date',
    description: 'Description',
    email: 'Email',
    endDate: 'End',
    entity: 'Entity',
    fluency: 'Fluency',
    highlights: 'Highlights',
    image: 'Photo',
    institution: 'Institution',
    keywords: 'Keywords',
    label: 'Title',
    language: 'Language',
    lastModified: 'Last modified',
    level: 'Level',
    location: 'Location',
    name: 'Name',
    network: 'Network',
    note: 'Note',
    organization: 'Organization',
    phone: 'Phone',
    postalCode: 'Postal code',
    position: 'Position',
    profiles: 'Profiles',
    publisher: 'Publisher',
    region: 'Region',
    reference: 'Text',
    releaseDate: 'Release date',
    required: 'Required',
    roles: 'Roles',
    score: 'Score',
    self: 'Summary',
    skills: 'Skills',
    startDate: 'Start',
    studyType: 'Study type',
    summary: 'Summary',
    title: 'Title',
    type: 'Type',
    url: 'URL',
    username: 'Username',
    version: 'Version',
  },
}

const VALIDATION_MESSAGES: Record<ResumeLanguage, Record<string, string>> = {
  pt_BR: {
    'Campo obrigatório.': 'Campo obrigatório.',
    'Data inválida.': 'Data inválida.',
    'E-mail inválido.': 'E-mail inválido.',
    'JSON precisa ser um objeto.': 'JSON precisa ser um objeto.',
    'O JSON precisa ser um objeto.': 'O JSON precisa ser um objeto.',
    'URL inválida.': 'URL inválida.',
  },
  en_US: {
    'Campo obrigatório.': 'Required field.',
    'Data inválida.': 'Invalid date.',
    'E-mail inválido.': 'Invalid email.',
    'JSON precisa ser um objeto.': 'JSON must be an object.',
    'O JSON precisa ser um objeto.': 'JSON must be an object.',
    'URL inválida.': 'Invalid URL.',
  },
}

function translateKey(language: ResumeLanguage, key: string): string {
  return FIELD_LABELS[language][key] ?? SECTION_TITLES[language][key] ?? key
}

function translateField(field: FieldDefinition, language: ResumeLanguage): FieldDefinition {
  return {
    ...field,
    label: translateKey(language, field.key),
  }
}

function translateNestedSection(section: NestedSectionDefinition, language: ResumeLanguage): NestedSectionDefinition {
  return {
    ...section,
    title: translateKey(language, section.key),
    fields: section.fields.map((field) => translateField(field, language)),
  }
}

function translateObjectSection(section: ObjectSectionDefinition, language: ResumeLanguage): ObjectSectionDefinition {
  return {
    ...section,
    title: translateKey(language, section.key),
    fields: section.fields.map((field) => translateField(field, language)),
    nested: section.nested?.map((nested) => translateNestedSection(nested, language)),
  }
}

function translateArraySection(section: ArraySectionDefinition, language: ResumeLanguage): ArraySectionDefinition {
  const sectionKey = getPathKey(section.path)

  return {
    ...section,
    title: ARRAY_SECTION_TITLES[language][sectionKey] ?? translateKey(language, sectionKey),
    itemTitle: ITEM_TITLES[language][sectionKey] ?? section.itemTitle,
    fields: section.fields.map((field) => translateField(field, language)),
  }
}

export function getUiStrings(language: ResumeLanguage): UiStrings {
  return UI_STRINGS[language]
}

export function getFormSections(language: ResumeLanguage): SectionDefinition[] {
  return FORM_SECTIONS.map((section) => {
    if ('key' in section) {
      return translateObjectSection(section, language)
    }

    return translateArraySection(section, language)
  })
}

export function getTranslatedSectionLabel(language: ResumeLanguage, key: string): string {
  return translateKey(language, key)
}

function formatPathPart(language: ResumeLanguage, part: string): string {
  if (/^\d+$/.test(part)) {
    return `item ${Number(part) + 1}`
  }

  if (language !== 'en_US') {
    return part
  }

  const translated = translateKey(language, part)

  return translated === part ? part : translated
}

export function getTranslatedPathLabel(language: ResumeLanguage, pathParts: string[]): string {
  if (pathParts.length === 0) {
    return language === 'en_US' ? 'resume' : 'currículo'
  }

  return pathParts.map((part) => formatPathPart(language, part)).join(' / ')
}

export function translateValidationMessage(message: string, language: ResumeLanguage): string {
  return VALIDATION_MESSAGES[language][message] ?? message
}

export function formatCountLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

export function getLanguageLocale(language: ResumeLanguage): string {
  return language === 'en_US' ? 'en-US' : 'pt-BR'
}

export function lowercaseForLanguage(value: string, language: ResumeLanguage): string {
  return value.toLocaleLowerCase(getLanguageLocale(language))
}

export function formatTemplate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [placeholder, value]) => result.replaceAll(`{${placeholder}}`, value),
    template,
  )
}
