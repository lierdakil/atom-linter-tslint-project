"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var ts = require("typescript");
var tslint_1 = require("tslint");
function find(collection, predicate) {
    for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
        var item = collection_1[_i];
        if (predicate(item)) {
            return item;
        }
    }
    return null;
}
function isNullable(type) {
    if ([ts.SyntaxKind.UnionType, ts.SyntaxKind.IntersectionType].indexOf(type.kind) !== -1) {
        var unionOrIntersection = type;
        return unionOrIntersection.types.some(isNullable);
    }
    return [ts.SyntaxKind.NullKeyword, ts.SyntaxKind.UndefinedKeyword].indexOf(type.kind) !== -1;
}
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoUninitializedClassPropertiesWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(tslint_1.Rules.AbstractRule));
exports.Rule = Rule;
var NoUninitializedClassPropertiesWalker = (function (_super) {
    __extends(NoUninitializedClassPropertiesWalker, _super);
    function NoUninitializedClassPropertiesWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.assignedPropertyStack = [];
        return _this;
    }
    NoUninitializedClassPropertiesWalker.prototype.visitClassDeclaration = function (node) {
        // Loop through constructor statements and look for property assignments.
        // We can't do this in 'visitConstructorDeclaration' since properties
        // may be visited before the constructor which means we won't have access
        // to assignment data.
        var assignedProperties = [];
        var constructor = find(node.members, function (it) { return it.kind === ts.SyntaxKind.Constructor; });
        if (constructor) {
            for (var _i = 0, _a = constructor.body.statements; _i < _a.length; _i++) {
                var stmt = _a[_i];
                if (stmt.kind !== ts.SyntaxKind.ExpressionStatement) {
                    continue;
                }
                var ex = stmt;
                if (ex.expression.kind !== ts.SyntaxKind.BinaryExpression) {
                    continue;
                }
                var assignment = ex.expression;
                if (assignment.left.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                    continue;
                }
                var leftOperand = assignment.left;
                if (leftOperand.expression.kind === ts.SyntaxKind.ThisKeyword) {
                    assignedProperties.push(leftOperand.name.getText());
                }
            }
        }
        this.assignedPropertyStack.push(assignedProperties);
        _super.prototype.visitClassDeclaration.call(this, node);
        this.assignedPropertyStack.pop();
    };
    NoUninitializedClassPropertiesWalker.prototype.visitPropertyDeclaration = function (node) {
        var name = node.name.getText();
        var isAssigned = this.assignedPropertyStack[this.assignedPropertyStack.length - 1].indexOf(name) !== -1;
        if (!node.initializer && !node.questionToken && !isNullable(node.type) && !isAssigned) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), "Property '" + node.name.getText() + "' is never initialized"));
        }
        _super.prototype.visitPropertyDeclaration.call(this, node);
    };
    return NoUninitializedClassPropertiesWalker;
}(tslint_1.RuleWalker));
