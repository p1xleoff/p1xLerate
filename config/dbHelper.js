import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_TASKS = 'tasks';
const KEY_LISTS = 'lists';
const KEY_ROUTINES = 'routines';
const KEY_SUBROUTINES = 'subroutines';

//tasks
const saveTasksToStorage = async (tasks) => {
  try {
    await AsyncStorage.setItem(KEY_TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to AsyncStorage', error);
  }
};

const fetchTasksFromStorage = async () => {
  try {
    const storedTasks = await AsyncStorage.getItem(KEY_TASKS);
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error('Error fetching tasks from AsyncStorage', error);
    return [];
  }
};

//lists
const saveListsToStorage = async (lists) => {
  try {
    await AsyncStorage.setItem(KEY_LISTS, JSON.stringify(lists));
  } catch (error) {
    console.error('Error saving lists to AsyncStorage', error);
  }
};

const fetchListsFromStorage = async () => {
  try {
    const storedLists = await AsyncStorage.getItem(KEY_LISTS);
    // console.log('Stored Lists:', storedLists);
    return storedLists ? JSON.parse(storedLists) : [];
  } catch (error) {
    console.error('Error fetching lists from AsyncStorage', error);
    return [];
  }
};

//routines
const saveRoutinesToStorage = async (routines) => {
  try {
    await AsyncStorage.setItem(KEY_ROUTINES, JSON.stringify(routines));
  } catch (error) {
    console.error('Error saving routines to AsyncStorage', error);
  }
  //console.log('routine saved');
};

const fetchRoutinesFromStorage = async () => {
  try {
    const storedRoutines = await AsyncStorage.getItem(KEY_ROUTINES);
    return storedRoutines ? JSON.parse(storedRoutines) : [];
  } catch (error) {
    console.error('Error fetching routines from AsyncStorage', error);
    return [];
  }
};

const saveSubroutinesToStorage = async (routineId, subroutines) => {
  try {
    await AsyncStorage.setItem(`${KEY_SUBROUTINES}_${routineId}`, JSON.stringify(subroutines));
  } catch (error) {
    console.error('Error saving subroutines to AsyncStorage', error);
  }
};

const fetchSubroutinesFromStorage = async (routineId) => {
  try {
    const storedSubroutines = await AsyncStorage.getItem(`${KEY_SUBROUTINES}_${routineId}`);
    return storedSubroutines ? JSON.parse(storedSubroutines) : [];
  } catch (error) {
    console.error('Error fetching subroutines from AsyncStorage', error);
    return [];
  }
};
//calculate number of subroutines in a routine
const calculateTotalSubroutines = (routines) => {
  return routines.reduce((total, routine) => total + routine.subroutines.length, 0);
};

export {
  saveTasksToStorage,
  fetchTasksFromStorage,
  saveListsToStorage,
  fetchListsFromStorage,
  saveRoutinesToStorage, 
  fetchRoutinesFromStorage,
  saveSubroutinesToStorage,
  fetchSubroutinesFromStorage,
  calculateTotalSubroutines
};
