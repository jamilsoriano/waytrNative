import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

import { useDocument, useCollection } from "react-firebase-hooks/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyBfL5Zv3KtO5T-jF8yPf96LlcKsUgULWws",
  authDomain: "waytr-f5fb7.firebaseapp.com",
  databaseURL: "https://waytr-f5fb7.firebaseio.com",
  projectId: "waytr-f5fb7",
  storageBucket: "waytr-f5fb7.appspot.com",
  messagingSenderId: "890384060345",
  appId: "1:890384060345:web:ccd51196e55ede05923068",
  measurementId: "G-RZNMHQCF94"
};

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.functions = firebase.functions();
  }

  async loginEmail(email, password) {
    const user = await this.auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => {
        console.log(err);
        return err;
      });
    return user;
  }

  async signOut() {
    const SignOut = this.auth.signOut().catch(err => {
      console.log(err);
      return err;
    });
    return SignOut;
  }

  async signUp(newUser) {
    const { firstName, lastName, email, password } = newUser;
    const user = await this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        response.user.updateProfile({
          displayName: firstName
        });
        this.db
          .collection("users")
          .doc(response.user.uid)
          .set({
            firstName,
            lastName
          });
        return response;
      })
      .catch(err => {
        console.log(err);
        return err;
      });
    return user;
  }

  async registerRest(newRestaurant) {
    const {
      restName,
      restStreetAddress,
      restSuburb,
      restPostcode,
      restPhoneNumber,
      restCuisine,
      restUID
    } = newRestaurant;

    this.db
      .collection("restaurants")
      .doc()
      .set({
        restName,
        restStreetAddress,
        restSuburb,
        restPostcode,
        restPhoneNumber,
        restCuisine,
        restUID
      })
      .catch(error => {
        return error;
      });
  }

  async getUserData(uid) {
    let userData = {};
    const [value, loading, error] = await useDocument(
      this.db.doc("users/" + uid)
    );
    if (error) {
      console.log(error);
    }
    if (!loading && value.data()) {
      userData = value.data();
    }
    return { userData, loading };
  }

  async getRestaurantList() {
    let restCollection = [];
    const [value, loading, error] = await useCollection(
      this.db.collection("restaurants")
    );
    if (error) {
      console.log(error);
    }
    if (!loading && value) {
      value.docs.map(document => {
        return (restCollection = [...restCollection, document.data()]);
      });
    }
    return { restCollection, loading };
  }

  async getRestaurantMenu(restid) {
    let menu = {};
    const [value, loading, error] = await useDocument(
      this.db.doc("menu/" + restid)
    );
    if (!loading && value.data()) {
      menu = value.data();
    }
    return { menu, loading, error };
  }

  async getPreviousOrders(userID) {
    let docs = [];
    orders = await this.db
      .collection("orders")
      .where("uid", "==", userID)
      .orderBy("orderDateTime", "desc")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          docs = [...docs, doc.data()];
          return docs;
        });
        return docs;
      });
    return orders;
  }

  async sendOrder(orderInfo) {
    const {
      orders,
      restaurantId,
      restName,
      tableNum,
      uid,
      orderDateTime,
      orderCompleted
    } = orderInfo;
    this.db
      .collection("orders")
      .doc()
      .set({
        orders,
        restaurantId,
        restName,
        tableNum,
        uid,
        orderDateTime,
        orderCompleted
      })
      .catch(error => {
        return error;
      });
  }

  completeOrder({ dbOrders, orderDocId }) {
    this.db
      .collection("orders")
      .doc(orderDocId)
      .update({ orderCompleted: true });
  }
}

export default new Firebase();
