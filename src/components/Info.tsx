const classes = {
  group: 'pl-4 mb-12',
  h3: 'text-xl font-semibold',
  h5: 'font-semibold mt-6',
  p: 'pl-4 my-2',
}
function Info() {
  return (
    <div className='max-w-xl'>

      <p className='mb-4'>
        The Woodworking Calculator estimates material costs for woodworking projects.
      </p>

      <h3 className={classes.h3}>The basics of a project</h3>
      <div className={classes.group}>
        <h5 className={classes.h5}>Components</h5>
        <p className={classes.p}>
          The individual parts that make up a piece of furniture. Their measurements are used to calculate material
          needed.
        </p>
        <h5 className={classes.h5}>Component Groups</h5>
        <p className={classes.p}>
          A convenience to group components together for clarity and to help manage part quantities.
        </p>
        <h5 className={classes.h5}>Materials</h5>
        <p className={classes.p}>
          The raw materials that a project is built out of. They contain the pricing and calculation information.
        </p>
      </div>

      <h3 className={classes.h3}>Material Types</h3>
      <p className={classes.p}>
        There are three types of materials, calculated in three different ways, described below.
      </p>
      <div className={classes.group}>

        <h5 className={classes.h5}>Board Feet</h5>
        <p className={classes.p}>
          The main reason this tool exists. Calculating board feet is cumbersome.
        </p>
        <p className={classes.p}>
          In case you’re unfamiliar: a board foot is a unit of measurement used when selling rough lumber. A board foot
          is
          1/12th of a cubic foot.
        </p>
        <p className={classes.p}>
          Board feet are calculated using the length and width of components and the thickness of the raw material.
          (After all, that’s what you’re buying.)
        </p>
        <h5 className={classes.h5}>Linear Feet</h5>
        <p className={classes.p}>
          This one is much simpler. Cost is calculated by multiplying the length of the part by the cost per foot of the
          material. Linear feet can be used for things like dimensional lumber, s4s lumber, and premade trim.
        </p>
        <h5 className={classes.h5}>Square Feet</h5>

        <p className={classes.p}>
          Used primarily for sheet goods: plywood, MDF, etc. Calculating material used takes the length and width from
          each component.
        </p>
        <h5 className={classes.h5}>Miscellaneous Materials</h5>
        <p className={classes.p}>
          Meant to be used for accessories, like cabinet pulls or hinges. Basically you add a cost and a quantity.
          Miscellaneous materials exist so you can add whatever costs you want and see them in the final estimated
          total.
        </p>
        <h5 className={classes.h5}>Waste Factor</h5>
        <p className={classes.p}>
          The three main material types also include an optional waste factor that will add the provided percentage onto
          the final totals for the material.
        </p>
        <p className={classes.p}>
          Why? You’re not buying the premade components, so you’re going to be cutting and shaping raw material down to
          the final size, creating waste along the way.
        </p>
      </div>

    </div>
  );
}

export default Info;