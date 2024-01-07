import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_TASKS = 'tasks';
const KEY_LISTS = 'lists';
const KEY_ROUTINES = 'routines';

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
  console.log('routine saved');
};

const fetchRoutinesFromStorage = async () => {
  try {
    const storedRoutines = await AsyncStorage.getItem(KEY_ROUTINES);
    return storedRoutines ? JSON.parse(storedRoutines) : [];
  } catch (error) {
    console.error('Error fetching routines from AsyncStorage', error);
    return [];
  }
  console.log(storedRoutines);
};
export {
  saveTasksToStorage,
  fetchTasksFromStorage,
  saveListsToStorage,
  fetchListsFromStorage,
  saveRoutinesToStorage, 
  fetchRoutinesFromStorage,
};
