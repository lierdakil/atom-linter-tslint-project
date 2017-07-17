import * as ts from 'typescript'
import { Rules, RuleWalker, RuleFailure } from 'tslint'

function find<T>(collection: T[], predicate: (it: T) => boolean): T | null {
    for (const item of collection) {
        if (predicate(item)) {
            return item
        }
    }
    return null
}

function isNullable(type: ts.TypeNode): boolean {
    if ([ts.SyntaxKind.UnionType, ts.SyntaxKind.IntersectionType].indexOf(type.kind) !== -1) {
        const unionOrIntersection = <ts.UnionOrIntersectionTypeNode>type
        return unionOrIntersection.types.some(isNullable)
    }
    return [ts.SyntaxKind.NullKeyword, ts.SyntaxKind.UndefinedKeyword].indexOf(type.kind) !== -1
}

export class Rule extends Rules.AbstractRule {
    apply(sourceFile: ts.SourceFile): RuleFailure[] {
        return this.applyWithWalker(new NoUninitializedClassPropertiesWalker(sourceFile, this.getOptions()))
    }
}

class NoUninitializedClassPropertiesWalker extends RuleWalker {

    private assignedPropertyStack: string[][] = []

    visitClassDeclaration(node: ts.ClassDeclaration) {
        // Loop through constructor statements and look for property assignments.
        // We can't do this in 'visitConstructorDeclaration' since properties
        // may be visited before the constructor which means we won't have access
        // to assignment data.
        const assignedProperties: string[] = []
        const constructor = <ts.ConstructorDeclaration>find(node.members, it => it.kind === ts.SyntaxKind.Constructor)
        if (constructor) {
            for (const stmt of constructor.body!.statements) {
                if (stmt.kind !== ts.SyntaxKind.ExpressionStatement) {
                    continue
                }
                const ex = <ts.ExpressionStatement>stmt
                if (ex.expression.kind !== ts.SyntaxKind.BinaryExpression) {
                    continue
                }
                const assignment = <ts.BinaryExpression>ex.expression
                if (assignment.left.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                    continue
                }
                const leftOperand = <ts.PropertyAccessExpression>assignment.left
                if (leftOperand.expression.kind === ts.SyntaxKind.ThisKeyword) {
                    assignedProperties.push(leftOperand.name.getText())
                }
            }
        }
        this.assignedPropertyStack.push(assignedProperties)
        super.visitClassDeclaration(node)
        this.assignedPropertyStack.pop()
    }

    visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        const name = node.name.getText()
        const isAssigned = this.assignedPropertyStack[this.assignedPropertyStack.length - 1].indexOf(name) !== -1
        if (!node.initializer && !node.questionToken && !isNullable(node.type!) && !isAssigned) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), `Property '${node.name.getText()}' is never initialized`))
        }
        super.visitPropertyDeclaration(node)
    }

}
