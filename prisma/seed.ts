import { PrismaClient, SkillType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Expertise Areas
  const technicalArchitect = await prisma.expertiseArea.upsert({
    where: { name: 'Technical Architect' },
    update: {},
    create: {
      name: 'Technical Architect',
      description: 'Overall technical architecture and system design',
      order: 1,
    },
  })

  const electronica = await prisma.expertiseArea.upsert({
    where: { name: 'Electronica' },
    update: {},
    create: {
      name: 'Electronica',
      description: 'Electronics engineering and design',
      order: 2,
    },
  })

  const mechanica = await prisma.expertiseArea.upsert({
    where: { name: 'Mechanica' },
    update: {},
    create: {
      name: 'Mechanica',
      description: 'Mechanical engineering and design',
      order: 3,
    },
  })

  const software = await prisma.expertiseArea.upsert({
    where: { name: 'Software' },
    update: {},
    create: {
      name: 'Software',
      description: 'Software development and engineering',
      order: 4,
    },
  })

  console.log('✅ Created expertise areas')

  // Technical Architect Skills
  const taSkills = [
    'Algemene kennis Electronica',
    'Algemene kennis Mechanica',
    'Algemene kennis Software',
    'Ontwerp Methodologie',
    'Lean Manufacturing',
  ]

  for (const [index, skillName] of taSkills.entries()) {
    await prisma.skill.upsert({
      where: {
        name_expertiseAreaId: {
          name: skillName,
          expertiseAreaId: technicalArchitect.id,
        },
      },
      update: {},
      create: {
        name: skillName,
        type: SkillType.GENERAL,
        expertiseAreaId: technicalArchitect.id,
        order: index + 1,
      },
    })
  }

  console.log('✅ Created Technical Architect skills')

  // Electronica Skills
  const electronicaSkills = [
    'Hoogfrequent',
    'Dataopslag',
    'ESD',
    'Sensoren',
    'Voeding',
  ]

  for (const [index, skillName] of electronicaSkills.entries()) {
    await prisma.skill.upsert({
      where: {
        name_expertiseAreaId: {
          name: skillName,
          expertiseAreaId: electronica.id,
        },
      },
      update: {},
      create: {
        name: skillName,
        type: SkillType.GENERAL,
        expertiseAreaId: electronica.id,
        order: index + 1,
      },
    })
  }

  console.log('✅ Created Electronica skills')

  // Mechanica Skills
  const mechanicaSkills = [
    'Vormgeving',
    'Kunststof engineering en productie',
    'Metaal engineering en productie',
    'Plaatwerk engineering en productie',
  ]

  for (const [index, skillName] of mechanicaSkills.entries()) {
    await prisma.skill.upsert({
      where: {
        name_expertiseAreaId: {
          name: skillName,
          expertiseAreaId: mechanica.id,
        },
      },
      update: {},
      create: {
        name: skillName,
        type: SkillType.GENERAL,
        expertiseAreaId: mechanica.id,
        order: index + 1,
      },
    })
  }

  // Mechanica Tools
  const mechanicaTools = [
    'SolidWorks CAD',
    'SolidWorks CAM',
    'ProEngineer',
    'Fusion CAD',
    'Fusion CAM',
  ]

  for (const [index, skillName] of mechanicaTools.entries()) {
    await prisma.skill.upsert({
      where: {
        name_expertiseAreaId: {
          name: skillName,
          expertiseAreaId: mechanica.id,
        },
      },
      update: {},
      create: {
        name: skillName,
        type: SkillType.TOOL,
        expertiseAreaId: mechanica.id,
        order: mechanicaSkills.length + index + 1,
      },
    })
  }

  console.log('✅ Created Mechanica skills and tools')

  // Software Skills
  const softwareSkills = [
    'Architectuur',
    'Data analyse',
    'Back-end',
    'Front-end',
    'Embedded',
  ]

  for (const [index, skillName] of softwareSkills.entries()) {
    await prisma.skill.upsert({
      where: {
        name_expertiseAreaId: {
          name: skillName,
          expertiseAreaId: software.id,
        },
      },
      update: {},
      create: {
        name: skillName,
        type: SkillType.GENERAL,
        expertiseAreaId: software.id,
        order: index + 1,
      },
    })
  }

  // Software Languages
  const softwareLanguages = [
    'Assembly',
    'C',
    'C++',
    'Javascript',
    'Java',
    'Python',
    'VHDL',
  ]

  for (const [index, skillName] of softwareLanguages.entries()) {
    await prisma.skill.upsert({
      where: {
        name_expertiseAreaId: {
          name: skillName,
          expertiseAreaId: software.id,
        },
      },
      update: {},
      create: {
        name: skillName,
        type: SkillType.LANGUAGE,
        expertiseAreaId: software.id,
        order: softwareSkills.length + index + 1,
      },
    })
  }

  console.log('✅ Created Software skills and languages')

  // Create initial users (unclaimed profiles)
  const user1 = await prisma.user.upsert({
    where: { linkedInUrl: 'https://www.linkedin.com/in/avanderheijde/' },
    update: {},
    create: {
      name: 'A. van der Heijde',
      linkedInUrl: 'https://www.linkedin.com/in/avanderheijde/',
      claimed: false,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { linkedInUrl: 'https://www.linkedin.com/in/choogendijk/' },
    update: {},
    create: {
      name: 'C. Hoogendijk',
      linkedInUrl: 'https://www.linkedin.com/in/choogendijk/',
      claimed: false,
    },
  })

  const user3 = await prisma.user.upsert({
    where: { linkedInUrl: 'https://www.linkedin.com/in/michiel-wanninkhof-0443488a/' },
    update: {},
    create: {
      name: 'M. Wanninkhof',
      linkedInUrl: 'https://www.linkedin.com/in/michiel-wanninkhof-0443488a/',
      claimed: false,
    },
  })

  console.log('✅ Created initial user profiles')
  console.log(`   - ${user1.name}`)
  console.log(`   - ${user2.name}`)
  console.log(`   - ${user3.name}`)

  console.log('🎉 Database seed completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

