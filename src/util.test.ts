import { camelize } from './util'

test('should Camelize word string', () => {
  expect(camelize('EquipmentClass name')).toBe('equipmentClassName')
  expect(camelize('Equipment className')).toBe('equipmentClassName')
  expect(camelize('equipment class name')).toBe('equipmentClassName')
  expect(camelize('Equipment Class Name')).toBe('equipmentClassName')
})
