import inquirer from "inquirer";
import chalk from "chalk";

export async function confirmBulkChanges(
  items,
  description
) {
  console.log(
    chalk.yellow(
      `\nYou are about to modify ${items.length} items`
    )
  );

  console.log(chalk.cyan(description));

  if (items.length > 10) {
    console.log(
      chalk.red("\nPREVIEW OF FIRST 10 ITEMS:\n")
    );

    items.slice(0, 10).forEach(item => {
      console.log(
        `- ${item.entry?.title || item.id}`
      );
    });

    console.log("");
  }

  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message:
        "Proceed with bulk update?",
      default: false
    }
  ]);

  return confirmed;
}