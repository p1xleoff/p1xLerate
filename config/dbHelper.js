import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_TASKS = 'tasks';
const KEY_LISTS = 'lists';

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

export {
  saveTasksToStorage,
  fetchTasksFromStorage,
  saveListsToStorage,
  fetchListsFromStorage,
};
