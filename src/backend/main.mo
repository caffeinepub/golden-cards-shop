import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Product {
    public type Series = {
      #pokemon;
      #naruto;
    };

    public type Product = {
      id : Nat;
      name : Text;
      series : Series;
      price : Nat;
      description : Text;
      imageUrl : Text;
    };
  };

  module Order {
    public type Status = {
      #pending;
      #processing;
      #shipped;
      #delivered;
    };

    public type Item = {
      productId : Nat;
      quantity : Nat;
    };

    public type Order = {
      id : Nat;
      customerName : Text;
      phone : Text;
      address : Text;
      items : [Item];
      total : Nat;
      status : Status;
      createdAt : Time.Time;
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let products = Map.empty<Nat, Product.Product>();
  let orders = Map.empty<Nat, Order.Order>();
  var nextOrderId = 1;
  stable var visitCount : Nat = 0;

  public shared func recordVisit() : async () {
    visitCount += 1;
  };

  public query func getVisitCount() : async Nat {
    visitCount;
  };

  public shared ({ caller }) func initialize() : async () {
    if (products.size() > 0) {
      return;
    };

    let initialProducts : [Product.Product] = [
      {
        id = 1;
        name = "Golden Pikachu VMAX";
        series = #pokemon;
        price = 4999;
        description = "Rare golden Pikachu VMAX card from the Pokemon series.";
        imageUrl = "https://example.com/pikachu.png";
      },
      {
        id = 2;
        name = "Golden Charizard";
        series = #pokemon;
        price = 5999;
        description = "Exclusive golden Charizard card for collectors.";
        imageUrl = "https://example.com/charizard.png";
      },
      {
        id = 3;
        name = "Golden Sasuke";
        series = #naruto;
        price = 3999;
        description = "Limited edition golden Sasuke card from Naruto.";
        imageUrl = "https://example.com/sasuke.png";
      },
      {
        id = 4;
        name = "Golden Naruto";
        series = #naruto;
        price = 3999;
        description = "Rare golden Naruto card.";
        imageUrl = "https://example.com/naruto.png";
      },
      {
        id = 5;
        name = "Golden Mewtwo";
        series = #pokemon;
        price = 5499;
        description = "Unique golden Mewtwo card.";
        imageUrl = "https://example.com/mewtwo.png";
      },
      {
        id = 6;
        name = "Golden Kakashi";
        series = #naruto;
        price = 4499;
        description = "Exclusive golden Kakashi card.";
        imageUrl = "https://example.com/kakashi.png";
      },
      {
        id = 7;
        name = "Golden Lugia";
        series = #pokemon;
        price = 4799;
        description = "Rare golden Lugia card from the Pokemon series.";
        imageUrl = "https://example.com/lugia.png";
      },
      {
        id = 8;
        name = "Golden Sakura";
        series = #naruto;
        price = 3499;
        description = "Limited edition golden Sakura card.";
        imageUrl = "https://example.com/sakura.png";
      },
    ];

    for (product in initialProducts.values()) {
      products.add(product.id, product);
    };
  };

  public query ({ caller }) func getProducts() : async [Product.Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product.Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public type CreateOrderInput = {
    customerName : Text;
    phone : Text;
    address : Text;
    items : [Order.Item];
    total : Nat;
  };

  public shared ({ caller }) func createOrder(input : CreateOrderInput) : async Nat {
    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order.Order = {
      id = orderId;
      customerName = input.customerName;
      phone = input.phone;
      address = input.address;
      items = input.items;
      total = input.total;
      status = #pending;
      createdAt = Time.now();
    };

    orders.add(orderId, order);
    orderId;
  };

  public query ({ caller }) func getOrders() : async [Order.Order] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users are not allowed to view orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Order.Status) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users are not allowed to update orders");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getSeriesText(series : Product.Series) : async Text {
    switch (series) {
      case (#pokemon) { "Pokemon" };
      case (#naruto) { "Naruto" };
    };
  };
};
