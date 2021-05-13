const db = require("../../data/db-config")

async function find() { // EXERCISE A

  const data = await db('schemes as sc')//FROM schemes as sc
    .select('sc.scheme_id', 'sc.scheme_name')//  sc.*,
    .count('st.step_id as number_of_steps')//count(st.step_id) as number_of_steps
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')//LEFT JOIN steps as st ON sc.scheme_id = st.scheme_id
    .groupBy('sc.scheme_id')//GROUP BY sc.scheme_id
    .orderBy('sc.scheme_id', "asc") //ORDER BY sc.scheme_id ASC
  return data
}

async function findById(scheme_id) { // EXERCISE B
  const data = await db('schemes as sc')
    .select('sc.scheme_name', 'st.*')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'asc')
  const result = data.reduce((acc, current) => {
    const { scheme_name, step_id, step_number, instructions } = current
    if (acc.steps) {
      acc.steps.push({ step_id, step_number, instructions })
    } else if (step_id === null) {
      acc = {
        scheme_id: parseInt(scheme_id),
        scheme_name: scheme_name,
        steps: []
      }
    }
    else {
      acc = {
        scheme_id: parseInt(scheme_id),
        scheme_name: scheme_name,
        steps: [{ step_id, step_number, instructions }]
      }
    }
    return acc
  }, {})
  return result
}

async function findSteps(scheme_id) {
  const data = await db('schemes as sc')
    .select('st.step_id', 'st.step_number', 'st.instructions', 'sc.scheme_name')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'asc')
  if (data[0].step_number === null) {
    return []
  } else {
    return data
  }
}

async function add(scheme) {
  return await db('schemes').insert(scheme).then(id => {
    return findById(...id)
  })
}

async function addStep(scheme_id, step) {
  await db('steps').insert({ ...step, scheme_id })
  return await findSteps(scheme_id)
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
