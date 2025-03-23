import { collection, doc, getDocs, setDoc, deleteDoc, query, where, orderBy, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Project } from '@/types/project';
import { User } from 'firebase/auth';

const USERS_COLLECTION = 'users';
const PROJECTS_COLLECTION = 'projects';

export const createUserProfile = async (user: User, username: string) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

export const saveProjectToFirebase = async (project: Project, userId: string) => {
  if (!userId || !project || !project.id) {
    throw new Error('Invalid project data or user ID');
  }

  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
    const updatedProject = {
      ...project,
      userId,
      updatedAt: new Date().toISOString()
    };

    // Validate required fields
    if (!updatedProject.name) {
      throw new Error('Project name is required');
    }

    await setDoc(projectRef, updatedProject, { merge: true });
    return updatedProject;
  } catch (error) {
    console.error('Error saving project to Firebase:', error);
    throw new Error('Failed to save project. Please check your connection and try again.');
  }
};

export const getProjectsFromFirebase = async (userId: string) => {
  if (!userId) {
    throw new Error('User ID is required to fetch projects');
  }

  try {
    const projectsQuery = query(
      collection(db, PROJECTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(projectsQuery);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      if (!data.name || !data.userId) {
        console.warn(`Invalid project data found for ID: ${doc.id}`);
        return null;
      }
      return { ...data, id: doc.id } as Project;
    }).filter(Boolean) as Project[];
  } catch (error) {
    console.error('Error fetching projects from Firebase:', error);
    throw new Error('Failed to fetch projects. Please try again later.');
  }
};

export const subscribeToProjects = (userId: string, callback: (projects: Project[]) => void) => {
  if (!userId) {
    console.error('User ID is required for project subscription');
    return () => {};
  }

  const projectsQuery = query(
    collection(db, PROJECTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(projectsQuery, (snapshot) => {
    const projects = snapshot.docs.map(doc => {
      const data = doc.data();
      if (!data.name || !data.userId) {
        console.warn(`Invalid project data found for ID: ${doc.id}`);
        return null;
      }
      return { ...data, id: doc.id } as Project;
    }).filter(Boolean) as Project[];
    callback(projects);
  }, (error) => {
    console.error('Error subscribing to projects:', error);
    callback([]);
  });
};

export const deleteProjectFromFirebase = async (projectId: string) => {
  if (!projectId) {
    throw new Error('Project ID is required to delete a project');
  }

  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(projectRef);
    return true;
  } catch (error) {
    console.error('Error deleting project from Firebase:', error);
    throw new Error('Failed to delete project. Please check your connection and try again.');
  }
};